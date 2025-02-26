import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SolicitudDto } from './Dtos/solicitud.dto';

@ApiBearerAuth()
@Controller('solicitudes')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @ApiOperation({ summary: 'Get solicitudes data' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about solicitudes',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/')
  async getAllSolicitudes() {
    const solicitudes = await this.solicitudService.getAllSolicitudes();
    return this.createResponse(solicitudes);
  }

  @ApiOperation({ summary: 'Get solicitudes data filtered by status approved' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about solicitudes where are approved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/aprobadas')
  async getSolicitudesAprobadas() {
    const solicitudes = await this.solicitudService.getSolicitudesAprobadas();
    return this.createResponse(solicitudes);
  }

  @ApiOperation({ summary: 'Get solicitudes data filtered by status declined' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about solicitudes where are declined',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/rechazadas')
  async getSolicitudesNoAprobadas() {
    const solicitudes = await this.solicitudService.getSolicitudesNoAprobadas();
    return this.createResponse(solicitudes);
  }

  @ApiOperation({ summary: 'Get solicitudes data filtered by status pending' })
  @ApiResponse({
    status: 200,
    description:
      'Return all data about solicitudes where are pending to approve or decline',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/pendientes-aprobar')
  async getSolicitudesEnEspera() {
    const solicitudes = await this.solicitudService.getSolicitudesEnEspera();
    return this.createResponse(solicitudes);
  }

  @ApiOperation({ summary: 'Get solicitud data by specific id' })
  @ApiResponse({
    status: 200,
    description: 'Return all data about solicitud with id parameter',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not found' })
  @Get('/:id')
  async getSolicitudById(@Param('id') id: number) {
    const solicitud = await this.solicitudService.getSolicitudById(id);
    if (!solicitud) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Solicitud con ID: ${id} no encontrada.`,
      };
    }
    return this.createResponse(solicitud);
  }

  @ApiOperation({ summary: 'Approve a solicitud by specific id' })
  @ApiResponse({ status: 200, description: 'Solicitud approved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not found' })
  @Put('/aprobar/:id')
  async aprobarSolicitud(
    @Param('id') id: number,
    @Body() body: { salaId: number; horaInicio?: string; horaFin?: string },
  ) {
    await this.solicitudService.aprobarSolicitud(
      id,
      body.salaId,
      body.horaInicio,
      body.horaFin,
    );
    return {
      status: HttpStatus.OK,
      message: `La solicitud con ID: ${id} ha sido aprobada.`,
    };
  }

  @ApiOperation({ summary: 'Decline a solicitud by specific id' })
  @ApiResponse({ status: 200, description: 'Solicitud declined successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solicitud Not found' })
  @Put('/rechazar/:id')
  async rechazarSolicitud(@Param('id') id: number) {
    await this.solicitudService.rechazarSolicitud(id);
    return {
      status: HttpStatus.BAD_REQUEST,
      message: `La solicitud con ID: ${id} ha sido rechazada.`,
    };
  }

  @Post('/crear')
  @ApiOperation({ summary: 'Create a new request to booking a room' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSolicitud(@Body() solicitudDto: SolicitudDto) {
    return this.solicitudService.createSolicitud(solicitudDto);
  }

  private createResponse(data: any) {
    return {
      status: HttpStatus.OK,
      message: 'ok',
      data: data,
    };
  }
}
