import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { config } from 'dotenv';
import { DB_TYPES } from '../Constants/database.const';
import { User } from 'src/Entities/user.entity';
import { Solicitud } from 'src/Entities/solicitud.entity';
import { Sala } from 'src/Entities/sala.entity';
import { Secretaria } from 'src/Entities/secretaria.entity';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: DB_TYPES[process.env.DB_TYPE] || 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Solicitud, Sala, Secretaria],
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly connection: Connection) {}
}
