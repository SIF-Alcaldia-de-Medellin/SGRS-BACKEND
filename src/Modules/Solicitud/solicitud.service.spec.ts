/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudService } from './solicitud.service';
import { Solicitud } from '@Entities/solicitud.entity';
import { Sala } from '@Entities/sala.entity';
import { Secretaria } from '@Entities/secretaria.entity';
import { User } from '@Entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SolicitudDto } from './Dtos/solicitud.dto';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let solicitudRepo: Repository<Solicitud>;
  let salaRepo: Repository<Sala>;
  let secretariaRepo: Repository<Secretaria>;
  let userRepo: Repository<User>;

  const mockSolicitudRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockSalaRepo = {
    findOne: jest.fn(),
  };

  const mockSecretariaRepo = {
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolicitudService,
        { provide: getRepositoryToken(Solicitud), useValue: mockSolicitudRepo },
        { provide: getRepositoryToken(Sala), useValue: mockSalaRepo },
        {
          provide: getRepositoryToken(Secretaria),
          useValue: mockSecretariaRepo,
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<SolicitudService>(SolicitudService);
    solicitudRepo = module.get(getRepositoryToken(Solicitud));
    salaRepo = module.get(getRepositoryToken(Sala));
    secretariaRepo = module.get(getRepositoryToken(Secretaria));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getAllSolicitudes', () => {
    it('debería obtener todas las solicitudes', async () => {
      mockSolicitudRepo.find.mockResolvedValue([{ id: 1, Estado: 2 }]);
      const result = await service.getAllSolicitudes();
      expect(result).toEqual([{ id: 1, Estado: 2 }]);
      expect(solicitudRepo.find).toHaveBeenCalled();
    });
    it('deberia retornar una lista vacia si no hay datos en la base de dattos', async () => {
      mockSolicitudRepo.find.mockResolvedValue([]);
      const result = await service.getAllSolicitudes();
      expect(result).toEqual([]);
      expect(solicitudRepo.find).toHaveBeenCalled();
    });
  });

  describe('getSolicitudById', () => {
    it('debería obtener una solicitud por ID', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue({ id: 1, Estado: 2 });
      const result = await service.getSolicitudById(1);
      expect(result).toEqual({ id: 1, Estado: 2 });
      expect(solicitudRepo.findOne).toHaveBeenCalledWith({
        where: { id_solicitudes: 1 },
        relations: ['id_sala', 'id_secretarias'],
      });
    });

    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue(null);
      await expect(service.getSolicitudById(99)).rejects.toThrow(
        new NotFoundException(`Solicitud con ID 99 no encontrada`),
      );
    });
  });

  describe('aprobarSolicitud', () => {
    it('debería aprobar una solicitud', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue({
        id_solicitudes: 1,
        Estado: 2,
      });
      mockSalaRepo.findOne.mockResolvedValue({ id_sala: 101 });

      const result = await service.aprobarSolicitud(1, 101, '08:00', '10:00');

      expect(result).toEqual({
        id_solicitudes: 1,
        Estado: 1, // Se corrigió la propiedad
        id_sala: { id_sala: 101 },
        Hora_inicio: '08:00',
        Hora_final: '10:00',
      });

      expect(solicitudRepo.save).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue(null);
      await expect(service.aprobarSolicitud(99, 101)).rejects.toThrow(
        new NotFoundException(`Solicitud con ID 99 no encontrada`),
      );
    });

    it('debería lanzar NotFoundException si la sala no existe', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue({
        id_solicitudes: 1,
        Estado: 2,
      });
      mockSalaRepo.findOne.mockResolvedValue(null);
      await expect(service.aprobarSolicitud(1, 999)).rejects.toThrow(
        new NotFoundException(`Sala con ID 999 no encontrada`),
      );
    });
  });

  describe('rechazarSolicitud', () => {
    it('debería rechazar una solicitud', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue({
        id_solicitudes: 2,
        Estado: 2,
      });

      const result = await service.rechazarSolicitud(2);

      expect(result).toEqual({
        id_solicitudes: 2,
        Estado: 0, // Se corrigió la propiedad
      });

      expect(solicitudRepo.save).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockSolicitudRepo.findOne.mockResolvedValue(null);
      await expect(service.rechazarSolicitud(99)).rejects.toThrow(
        new NotFoundException(`Solicitud con ID 99 no encontrada`),
      );
    });
  });

  describe('createSolicitud', () => {
    it('debería crear una nueva solicitud', async () => {
      mockSecretariaRepo.findOne.mockResolvedValue({ Nombre: 'Finanzas' });
      mockUserRepo.findOne.mockResolvedValue({ id: 1 });
      mockSolicitudRepo.save.mockResolvedValue({ id_solicitudes: 5 });

      const dto: SolicitudDto = {
        assistants: 10,
        purpose: 'Reunión de equipo',
        startTime: '10:00',
        endTime: '12:00',
        fecha_reserva: '2030-12-31', // Se cambió la fecha para evitar error de validación
        ministry: 'Finanzas',
        id_user: 1,
        additionalEquipment: ['Hdmi', 'Portatil'],
      };

      const result = await service.createSolicitud(dto);

      expect(result).toEqual({ id_solicitudes: 5 });
      expect(solicitudRepo.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si la secretaria o el usuario no existen', async () => {
      mockSecretariaRepo.findOne.mockResolvedValue(null);
      await expect(
        service.createSolicitud({
          id_user: 99,
          ministry: 'Inexistente',
          purpose: 'Prueba',
          fecha_reserva: '20-02-2025',
          startTime: '10:00:00',
          endTime: '12:00:00',
          assistants: 10,
        } as SolicitudDto),
      ).rejects.toThrow(
        new BadRequestException('Secretaria/Usuario no encontrado'),
      );
    });
  });
});
