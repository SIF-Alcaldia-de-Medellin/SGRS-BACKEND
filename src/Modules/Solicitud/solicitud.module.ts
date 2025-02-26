import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudController } from './solicitud.controller';
import { SolicitudService } from './solicitud.service';
import { Solicitud } from '@Entities/solicitud.entity';
import { Sala } from '@Entities/sala.entity';
import { Secretaria } from '@Entities/secretaria.entity';
import { User } from '@Entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud, Sala, Secretaria, User])],
  controllers: [SolicitudController],
  providers: [SolicitudService],
})
export class SolicitudModule {}
