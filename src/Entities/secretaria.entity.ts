import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Solicitud } from './solicitud.entity';

@Entity('TLB_SECRETARIA')
export class Secretaria {
  @PrimaryGeneratedColumn({ name: 'SEC_ID' })
  id_secretarias: number;

  @Column({ length: 60, name: 'SEC_NOMBRE' })
  Nombre: string;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.id_secretarias)
  solicitudes: Solicitud[];
}
