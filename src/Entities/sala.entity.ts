import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Solicitud } from './solicitud.entity';

@Entity('TBL_SALA')
export class Sala {
  @PrimaryGeneratedColumn({ name: 'SAL_ID' })
  id_sala: number;

  @Column('int', { name: 'SAL_CAPACIDAD' })
  Capacidad: number;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.id_sala)
  solicitudes: Solicitud[];
}
