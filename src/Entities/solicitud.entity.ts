import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Sala } from './sala.entity';
import { Secretaria } from './secretaria.entity';
import { User } from './user.entity';

@Entity('TBL_SOLICITUD')
export class Solicitud {
  @PrimaryGeneratedColumn({ name: 'SOL_ID' })
  id_solicitudes: number;

  @Column('time', { name: 'SOL_HORA_INICIO' })
  Hora_inicio: string;

  @Column('time', { name: 'SOL_HORA_FIN' })
  Hora_final: string;

  @Column('date', { name: 'SOL_FECHA_RESERVA' })
  Fecha_reserva: Date;

  @CreateDateColumn({ name: 'SOL_FECHA_SOLICITUD' })
  Fecha_solicitud: Date;

  @Column('int', { name: 'SOL_NUMERO_ASISTENTES' })
  Num_asistentes: number;

  @Column({ length: 255, name: 'SOL_PROPOSITO' })
  Proposito: string;

  @Column('tinyint', { name: 'SOL_PORTATIL' })
  Computador: boolean;

  @Column('tinyint', { name: 'SOL_HDMI' })
  HDMI: boolean;

  @Column('tinyint', { name: 'SOL_ESTADO' })
  Estado: number;

  @ManyToOne(() => Sala, (sala) => sala.solicitudes)
  @JoinColumn({ name: 'SOL_SAL_ID' })
  id_sala: Sala;

  @ManyToOne(() => Secretaria, (secretaria) => secretaria.solicitudes)
  @JoinColumn({ name: 'SOL_SEC_ID' })
  id_secretarias: Secretaria;

  @ManyToOne(() => User, (user) => user.solicitudes)
  @JoinColumn({ name: 'SOL_USU_ID' })
  id_user: User;
}
