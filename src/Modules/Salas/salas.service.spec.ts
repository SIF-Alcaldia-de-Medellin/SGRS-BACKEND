/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { SalasService } from './salas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Solicitud } from '../../Entities/solicitud.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

/* Creamos el mock para ejecutar las pruebas sin conexión a base de datos */
describe('SalasService', () => {
  let service: SalasService;
  let repository: Repository<Solicitud>;

  const mockSolicitudRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalasService,
        {
          provide: getRepositoryToken(Solicitud),
          useValue: mockSolicitudRepository,
        },
      ],
    }).compile();

    service = module.get<SalasService>(SalasService);
    repository = module.get<Repository<Solicitud>>(
      getRepositoryToken(Solicitud),
    );
  });
  /* Probamos que no esté indefinido*/
  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  /* Solicitamos la disponibilidad individual de la sala */
  describe('verificarDisponibilidadIndividual', () => {
    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockSolicitudRepository.findOne.mockResolvedValue(null);

      await expect(
        service.verificarDisponibilidadIndividual(1),
      ).rejects.toThrow(
        new NotFoundException('Solicitud no encontrada o no esta en espera'),
      );
    });
    /* Solicitar intervarlo  */
    it('debería retornar disponibilidad de salas si la solicitud existe', async () => {
      mockSolicitudRepository.findOne.mockResolvedValue({
        id_solicitudes: 1,
        Estado: 2,
        Fecha_reserva: '2024-02-15',
        Hora_inicio: '08:00',
        Hora_final: '10:00',
      });

      mockSolicitudRepository.find.mockResolvedValue([]);

      const result = await service.verificarDisponibilidadIndividual(1);

      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({
        id_sala: 1,
        estado: 1,
        rangoHoras: '08:00 - 10:00',
      });
    });
  });
  /* Solicitar disponibilidad Combinada */
  describe('verificarDisponibilidadCombinada', () => {
    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockSolicitudRepository.findOne.mockResolvedValue(null);

      await expect(service.verificarDisponibilidadCombinada(2)).rejects.toThrow(
        new NotFoundException('Solicitud no encontrada o no está en espera'),
      );
    });
    /* Solicitar intervalo */
    it('debería retornar disponibilidad combinada si la solicitud existe', async () => {
      mockSolicitudRepository.findOne.mockResolvedValue({
        id_solicitudes: 2,
        Estado: 2,
        Fecha_reserva: '2024-02-15',
        Hora_inicio: '09:00',
        Hora_final: '11:00',
      });

      mockSolicitudRepository.find.mockResolvedValue([]);

      const result = await service.verificarDisponibilidadCombinada(2);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id_sala: 7,
        estado: 1,
        rangoHoras: '09:00 - 11:00',
      });
    });
  });
});
