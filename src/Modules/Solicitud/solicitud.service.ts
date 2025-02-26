import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from '@Entities/solicitud.entity';
import { Sala } from '@Entities/sala.entity';
import {
  validarHoras,
  validateSolicitud,
} from '@Common/Validations/solicitud.validation';
import { Secretaria } from '@Entities/secretaria.entity';
import { SolicitudDto } from './Dtos/solicitud.dto';
import { User } from '@Entities/user.entity';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
    @InjectRepository(Secretaria)
    private readonly secretariaRepository: Repository<Secretaria>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllSolicitudes(): Promise<Solicitud[]> {
    const solicitudesAprobadas = await this.solicitudRepository.find();

    return solicitudesAprobadas;
  }

  async getSolicitudesAprobadas(): Promise<Solicitud[]> {
    const solicitudesAprobadas = await this.solicitudRepository.find({
      where: { Estado: 1 },
    });

    return solicitudesAprobadas;
  }

  async getSolicitudesNoAprobadas(): Promise<Solicitud[]> {
    const solicitudesNoAprobadas = await this.solicitudRepository.find({
      where: { Estado: 0 },
    });

    return solicitudesNoAprobadas;
  }

  async getSolicitudesEnEspera(): Promise<Solicitud[]> {
    const solicitudesEnEspera = await this.solicitudRepository.find({
      where: { Estado: 2 },
    });

    return solicitudesEnEspera;
  }

  async getSolicitudById(id: number) {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: id },
      relations: ['id_sala', 'id_secretarias'],
    });

    if (!solicitud)
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);

    return solicitud;
  }

  async aprobarSolicitud(
    id: number,
    salaId: number,
    horaInicio?: string,
    horaFin?: string,
  ): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: id },
      relations: ['id_sala', 'id_secretarias'],
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    const sala = await this.salaRepository.findOne({
      where: { id_sala: salaId },
    });
    if (!sala) {
      throw new NotFoundException(`Sala con ID ${salaId} no encontrada`);
    }
    solicitud.id_sala = sala;

    if (horaInicio && horaFin) {
      validarHoras(horaInicio, horaFin);
      solicitud.Hora_inicio = horaInicio;
      solicitud.Hora_final = horaFin;
    }

    solicitud.Estado = 1;

    await this.solicitudRepository.save(solicitud);

    return solicitud;
  }

  async rechazarSolicitud(id: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: id },
      relations: ['id_sala', 'id_secretarias'],
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    solicitud.Estado = 0;

    await this.solicitudRepository.save(solicitud);

    return solicitud;
  }

  async createSolicitud(dto: SolicitudDto): Promise<Solicitud> {
    const validatedDto = validateSolicitud(dto);

    const hasHDMI = dto.additionalEquipment?.includes('Hdmi');
    const hasComputador = dto.additionalEquipment?.includes('Portatil');

    const secretaria = await this.secretariaRepository.findOne({
      where: { Nombre: dto.ministry },
    });

    const user = await this.userRepository.findOne({
      where: { id: dto.id_user },
    });

    if (!secretaria || !user) {
      throw new BadRequestException('Secretaria/Usuario no encontrado');
    }

    const solicitud = new Solicitud();
    solicitud.Hora_inicio = validatedDto.startTime;
    solicitud.Hora_final = validatedDto.endTime;
    const fechaReserva = new Date(validatedDto.fecha_reserva);
    fechaReserva.setHours(
      fechaReserva.getHours() + fechaReserva.getTimezoneOffset() / 60,
    );
    solicitud.Fecha_reserva = fechaReserva;
    solicitud.Num_asistentes = validatedDto.assistants;
    solicitud.Proposito = validatedDto.purpose;
    solicitud.Computador = hasComputador;
    solicitud.HDMI = hasHDMI;
    solicitud.Estado = 2;
    solicitud.id_secretarias = secretaria;
    solicitud.id_user = user;

    return await this.solicitudRepository.save(solicitud);
  }
}
