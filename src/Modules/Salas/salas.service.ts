import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Solicitud } from '@Entities/solicitud.entity';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
  ) {}

  async verificarDisponibilidadIndividual(
    idSolicitud: number,
  ): Promise<string[]> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: idSolicitud, Estado: 2 },
      relations: ['id_sala'],
    });

    if (!solicitud) {
      throw new NotFoundException(
        'Solicitud no encontrada o no esta en espera',
      );
    }

    const { Fecha_reserva, Hora_inicio, Hora_final } = solicitud;

    const disponibilidadSalas = [];

    for (let i = 1; i <= 6; i++) {
      const solicitudesAprobadas = await this.solicitudRepository.find({
        where: {
          Estado: 1,
          Fecha_reserva: Fecha_reserva,
          Hora_inicio: LessThanOrEqual(Hora_final),
          Hora_final: MoreThanOrEqual(Hora_inicio),
          id_sala: Equal(i),
        },
      });

      disponibilidadSalas.push({
        id_sala: i,
        estado: solicitudesAprobadas.length > 0 ? 0 : 1,
        rangoHoras: `${Hora_inicio} - ${Hora_final}`,
      });
    }

    return disponibilidadSalas;
  }

  async verificarDisponibilidadCombinada(
    idSolicitud: number,
  ): Promise<{ id_sala: number; estado: number; rangoHoras: string }[]> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: idSolicitud, Estado: 2 },
    });

    if (!solicitud) {
      throw new NotFoundException(
        'Solicitud no encontrada o no está en espera',
      );
    }

    const { Fecha_reserva, Hora_inicio, Hora_final } = solicitud;

    const salasCombinadas = [
      { id: 7, individuales: [1, 2] },
      { id: 8, individuales: [3, 4] },
      { id: 9, individuales: [5, 6] },
    ];

    const disponibilidadSalas = await Promise.all(
      salasCombinadas.map(async ({ id, individuales }) => {
        const solicitudesAprobadas = await this.solicitudRepository.find({
          where: {
            Estado: 1,
            id_sala: Equal(id),
            Fecha_reserva: Fecha_reserva,
            Hora_inicio: LessThanOrEqual(Hora_final),
            Hora_final: MoreThanOrEqual(Hora_inicio),
          },
        });

        const individualesAprobadas = await Promise.all(
          individuales.map(async (sala) => {
            return this.solicitudRepository.find({
              where: {
                Estado: 1,
                id_sala: Equal(sala),
                Fecha_reserva: Fecha_reserva,
                Hora_inicio: LessThanOrEqual(Hora_final),
                Hora_final: MoreThanOrEqual(Hora_inicio),
              },
            });
          }),
        );

        const noDisponible =
          solicitudesAprobadas.length > 0 ||
          individualesAprobadas.some((solicitudes) => solicitudes.length > 0);

        return {
          id_sala: id,
          estado: noDisponible ? 0 : 1,
          rangoHoras: `${Hora_inicio} - ${Hora_final}`,
        };
      }),
    );

    return disponibilidadSalas;
  }

  private readonly horaApertura = '07:00:00';
  private readonly horaCierre = '17:00:00';

  async obtenerIntervalosIndividuales(
    idSolicitud: number,
  ): Promise<
    { id_sala: number; intervalos: { inicio: string; fin: string }[] }[]
  > {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: idSolicitud, Estado: 2 },
    });

    if (!solicitud) {
      throw new NotFoundException(
        'Solicitud no encontrada o no está en espera',
      );
    }

    const { Fecha_reserva } = solicitud;

    const disponibilidadSalas = [];

    for (let i = 1; i <= 6; i++) {
      const reservas = await this.solicitudRepository.find({
        where: {
          id_sala: Equal(i),
          Estado: 1,
          Fecha_reserva: Fecha_reserva,
          Hora_inicio: LessThanOrEqual(this.horaCierre),
          Hora_final: MoreThanOrEqual(this.horaApertura),
        },
        order: { Hora_inicio: 'ASC' },
      });

      const intervalos = [];
      let horaDisponibleInicio = this.horaApertura;

      reservas.forEach((reserva) => {
        if (horaDisponibleInicio < reserva.Hora_inicio) {
          intervalos.push({
            inicio: horaDisponibleInicio,
            fin: reserva.Hora_inicio,
          });
        }
        horaDisponibleInicio = reserva.Hora_final;
      });

      if (horaDisponibleInicio < this.horaCierre) {
        intervalos.push({
          inicio: horaDisponibleInicio,
          fin: this.horaCierre,
        });
      }

      disponibilidadSalas.push({ id_sala: i, intervalos });
    }

    return disponibilidadSalas;
  }

  async obtenerIntervalosCombinados(
    idSolicitud: number,
  ): Promise<
    { id_sala: number; intervalos: { inicio: string; fin: string }[] }[]
  > {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitudes: idSolicitud, Estado: 2 },
    });

    if (!solicitud) {
      throw new NotFoundException(
        'Solicitud no encontrada o no está en espera',
      );
    }

    const { Fecha_reserva } = solicitud;

    const salasCombinadas = [
      { id: 7, individuales: [1, 2] },
      { id: 8, individuales: [3, 4] },
      { id: 9, individuales: [5, 6] },
    ];

    const disponibilidadSalas = await Promise.all(
      salasCombinadas.map(async ({ id, individuales }) => {
        const solicitudesCombinadas = await this.solicitudRepository.find({
          where: {
            Estado: 1,
            id_sala: Equal(id),
            Fecha_reserva: Fecha_reserva,
            Hora_inicio: LessThanOrEqual(this.horaCierre),
            Hora_final: MoreThanOrEqual(this.horaApertura),
          },
          order: { Hora_inicio: 'ASC' },
        });

        const solicitudesIndividuales = await Promise.all(
          individuales.map(async (salaId) => {
            return this.solicitudRepository.find({
              where: {
                Estado: 1,
                id_sala: Equal(salaId),
                Fecha_reserva: Fecha_reserva,
                Hora_inicio: LessThanOrEqual(this.horaCierre),
                Hora_final: MoreThanOrEqual(this.horaApertura),
              },
              order: { Hora_inicio: 'ASC' },
            });
          }),
        );

        const todasSolicitudes = [
          ...solicitudesCombinadas,
          ...solicitudesIndividuales.flat(),
        ];

        todasSolicitudes.sort((a, b) =>
          a.Hora_inicio.localeCompare(b.Hora_inicio),
        );

        const intervalos = [];
        let horaDisponibleInicio = this.horaApertura;

        todasSolicitudes.forEach((reserva) => {
          if (horaDisponibleInicio < reserva.Hora_inicio) {
            intervalos.push({
              inicio: horaDisponibleInicio,
              fin: reserva.Hora_inicio,
            });
          }
          horaDisponibleInicio =
            reserva.Hora_final > horaDisponibleInicio
              ? reserva.Hora_final
              : horaDisponibleInicio;
        });

        if (horaDisponibleInicio < this.horaCierre) {
          intervalos.push({
            inicio: horaDisponibleInicio,
            fin: this.horaCierre,
          });
        }

        return { id_sala: id, intervalos };
      }),
    );

    return disponibilidadSalas;
  }
}
