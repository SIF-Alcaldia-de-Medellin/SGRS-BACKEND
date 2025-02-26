import { BadRequestException } from '@nestjs/common';
import { SolicitudDto } from '../../Modules/Solicitud/Dtos/solicitud.dto';

export function validateSolicitud(dto: SolicitudDto) {
  const currentDate = new Date();
  const fechaReserva = new Date(`${dto.fecha_reserva}T${dto.startTime}`);

  if (fechaReserva <= currentDate) {
    throw new BadRequestException('La fecha y hora deben ser futuras.');
  }

  dto.purpose = sanitize(dto.purpose);

  return dto;
}

export function validarHoras(horaInicio?: string, horaFin?: string): void {
  if (horaInicio && horaFin) {
    const horaInicioDate = new Date(`1970-01-01T${horaInicio}:00`);
    const horaFinDate = new Date(`1970-01-01T${horaFin}:00`);

    const horaMinima = new Date(`1970-01-01T07:00:00`);
    const horaMaxima = new Date(`1970-01-01T17:30:00`);

    if (horaInicioDate < horaMinima || horaFinDate > horaMaxima) {
      throw new BadRequestException(
        'Las horas deben estar entre las 7:00 AM y las 5:30 PM.',
      );
    }
  }
}

function sanitize(text: string): string {
  return text.replace(/<[^>]*>?/gm, '');
}
