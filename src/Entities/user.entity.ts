import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Solicitud } from './solicitud.entity';

@Entity('TBL_USUARIO')
export class User {
  @PrimaryGeneratedColumn({ name: 'USU_ID' })
  id: number;

  @Column({ name: 'USU_NOMBRE', length: 60 })
  name: string;

  @Column({ name: 'USU_APELLIDOS', length: 60 })
  last_name: string;

  @Column({ name: 'USU_CORREO', length: 100 })
  email: string;

  @Column('bigint', { name: 'USU_TELEFONO' })
  phone: number;

  @Column({ name: 'USU_ROL', length: 10 })
  role: string;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.id_user)
  solicitudes: Solicitud[];
}
