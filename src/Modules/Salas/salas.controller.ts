import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { SalasService } from './salas.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @ApiOperation({ summary: 'Get individual rooms available' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about individual rooms available',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not Found' })
  @Get('/disponibilidad-individual/:id')
  async verificarIndividual(@Param('id') idSolicitud: number) {
    const salas =
      await this.salasService.verificarDisponibilidadIndividual(idSolicitud);
    return this.createResponse(salas);
  }

  @ApiOperation({ summary: 'Get multiple rooms available' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about multiple rooms available',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not Found' })
  @Get('/disponibilidad-combinada/:id')
  async verificarCombinadas(@Param('id') idSolicitud: number) {
    const salas =
      await this.salasService.verificarDisponibilidadCombinada(idSolicitud);
    return this.createResponse(salas);
  }

  @ApiOperation({ summary: 'Get individual schedule available' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about individual schedule available',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not Found' })
  @Get('/intervalos-individual/:id')
  async obtenerIntervalosDisponibles(@Param('id') idSolicitud: number) {
    const intervalos =
      await this.salasService.obtenerIntervalosIndividuales(idSolicitud);
    return this.createResponse(intervalos);
  }

  @ApiOperation({ summary: 'Get multiple schedule available' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about multiple schedule available',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not Found' })
  @Get('/intervalos-combinados/:id')
  async obtenerDisponibilidadCombinada(@Param('id') idSolicitud: number) {
    const disponibilidad =
      await this.salasService.obtenerIntervalosCombinados(idSolicitud);
    return this.createResponse(disponibilidad);
  }

  private createResponse(data: any) {
    return {
      status: HttpStatus.OK,
      message: 'ok',
      data: data,
    };
  }
}
