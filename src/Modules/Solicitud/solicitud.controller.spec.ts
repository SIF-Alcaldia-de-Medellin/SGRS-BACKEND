import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudController } from './solicitud.controller';
import { SolicitudService } from './solicitud.service';
import { HttpStatus } from '@nestjs/common';
import { SolicitudDto } from './Dtos/solicitud.dto';

describe('SolicitudController', () => {
  let controller: SolicitudController;
  let service: SolicitudService;

  const mockSolicitudService = {
    getAllSolicitudes: jest.fn(() => [{ id: 1, estado: 'pendiente' }]),
    getSolicitudesAprobadas: jest.fn(() => [{ id: 2, estado: 'aprobada' }]),
    getSolicitudesNoAprobadas: jest.fn(() => [{ id: 3, estado: 'rechazada' }]),
    getSolicitudesEnEspera: jest.fn(() => [{ id: 4, estado: 'pendiente' }]),
    getSolicitudById: jest.fn((id) =>
      id === 1 ? { id, estado: 'pendiente' } : null,
    ),
    aprobarSolicitud: jest.fn(),
    rechazarSolicitud: jest.fn(),
    createSolicitud: jest.fn((dto) => ({ id: 5, ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudController],
      providers: [
        {
          provide: SolicitudService,
          useValue: mockSolicitudService,
        },
      ],
    }).compile();

    controller = module.get<SolicitudController>(SolicitudController);
    service = module.get<SolicitudService>(SolicitudService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllSolicitudes', () => {
    it('debería obtener todas las solicitudes', async () => {
      const result = await controller.getAllSolicitudes();
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'ok',
        data: [{ id: 1, estado: 'pendiente' }],
      });
      expect(service.getAllSolicitudes).toHaveBeenCalled();
    });
  });

  describe('getSolicitudesAprobadas', () => {
    it('debería obtener solicitudes aprobadas', async () => {
      const result = await controller.getSolicitudesAprobadas();
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'ok',
        data: [{ id: 2, estado: 'aprobada' }],
      });
      expect(service.getSolicitudesAprobadas).toHaveBeenCalled();
    });
  });

  describe('getSolicitudesNoAprobadas', () => {
    it('debería obtener solicitudes rechazadas', async () => {
      const result = await controller.getSolicitudesNoAprobadas();
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'ok',
        data: [{ id: 3, estado: 'rechazada' }],
      });
      expect(service.getSolicitudesNoAprobadas).toHaveBeenCalled();
    });
  });

  describe('getSolicitudesEnEspera', () => {
    it('debería obtener solicitudes pendientes', async () => {
      const result = await controller.getSolicitudesEnEspera();
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'ok',
        data: [{ id: 4, estado: 'pendiente' }],
      });
      expect(service.getSolicitudesEnEspera).toHaveBeenCalled();
    });
  });

  describe('getSolicitudById', () => {
    it('debería obtener una solicitud por ID', async () => {
      const result = await controller.getSolicitudById(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'ok',
        data: { id: 1, estado: 'pendiente' },
      });
      expect(service.getSolicitudById).toHaveBeenCalledWith(1);
    });

    it('debería devolver 404 si la solicitud no existe', async () => {
      const result = await controller.getSolicitudById(99);
      expect(result).toEqual({
        status: HttpStatus.NOT_FOUND,
        message: `Solicitud con ID: 99 no encontrada.`,
      });
      expect(service.getSolicitudById).toHaveBeenCalledWith(99);
    });
  });

  describe('aprobarSolicitud', () => {
    it('debería aprobar una solicitud', async () => {
      const result = await controller.aprobarSolicitud(1, {
        salaId: 101,
        horaInicio: '08:00',
        horaFin: '10:00',
      });
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'La solicitud con ID: 1 ha sido aprobada.',
      });
      expect(service.aprobarSolicitud).toHaveBeenCalledWith(
        1,
        101,
        '08:00',
        '10:00',
      );
    });
  });

  describe('rechazarSolicitud', () => {
    it('debería rechazar una solicitud', async () => {
      const result = await controller.rechazarSolicitud(2);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        message: 'La solicitud con ID: 2 ha sido rechazada.',
      });
      expect(service.rechazarSolicitud).toHaveBeenCalledWith(2);
    });
  });

  describe('createSolicitud', () => {
    it('debería crear una nueva solicitud', async () => {
      const dto: SolicitudDto = {
        assistants: 10,
        purpose: 'Reunión de equipo',
        startTime: '10:00',
        endTime: '12:00',
        fecha_reserva: '2024-02-20',
        ministry: 'Finanzas',
        id_user: 1,
        additionalEquipment: ['Proyector', 'Micrófono'],
      };

      const result = await controller.createSolicitud(dto);

      expect(result).toEqual({ id: 5, ...dto });
      expect(service.createSolicitud).toHaveBeenCalledWith(dto);
    });
  });
});
