/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { SalasController } from './salas.controller';
import { SalasService } from './salas.service';
import { HttpStatus } from '@nestjs/common';

describe('SalasController', () => {
  let controller: SalasController;
  let service: SalasService;

  const mockSalasService = {
    verificarDisponibilidadIndividual: jest.fn((id) => [
      { SAL_ID: id, disponible: true },
    ]),
    verificarDisponibilidadCombinada: jest.fn((id) => [
      { SAL_ID: id, disponible: false },
    ]),
    obtenerIntervalosIndividuales: jest.fn((id) => [
      { horaInicio: '08:00', horaFin: '10:00' },
    ]),
    obtenerIntervalosCombinados: jest.fn((id) => [
      { horaInicio: '10:00', horaFin: '12:00' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalasController],
      providers: [
        {
          provide: SalasService,
          useValue: mockSalasService,
        },
      ],
    }).compile();

    controller = module.get<SalasController>(SalasController);
    service = module.get<SalasService>(SalasService);
  });
  /* Preguntas la definición de la variable*/
  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería obtener disponibilidad individual', async () => {
    const result = await controller.verificarIndividual(1);
    expect(result).toEqual({
      status: HttpStatus.OK,
      message: 'ok',
      data: [{ SAL_ID: 1, disponible: true }],
    });
    expect(service.verificarDisponibilidadIndividual).toHaveBeenCalledWith(1);
  });

  it('debería obtener disponibilidad combinada', async () => {
    const result = await controller.verificarCombinadas(2);
    expect(result).toEqual({
      status: HttpStatus.OK,
      message: 'ok',
      data: [{ SAL_ID: 2, disponible: false }],
    });
    expect(service.verificarDisponibilidadCombinada).toHaveBeenCalledWith(2);
  });

  it('debería obtener intervalos individuales', async () => {
    const result = await controller.obtenerIntervalosDisponibles(3);
    expect(result).toEqual({
      status: HttpStatus.OK,
      message: 'ok',
      data: [{ horaInicio: '08:00', horaFin: '10:00' }],
    });
    expect(service.obtenerIntervalosIndividuales).toHaveBeenCalledWith(3);
  });

  it('debería obtener intervalos combinados', async () => {
    const result = await controller.obtenerDisponibilidadCombinada(4);
    expect(result).toEqual({
      status: HttpStatus.OK,
      message: 'ok',
      data: [{ horaInicio: '10:00', horaFin: '12:00' }],
    });
    expect(service.obtenerIntervalosCombinados).toHaveBeenCalledWith(4);
  });
});
