import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalasController } from './salas.controller';
import { SalasService } from './salas.service';
import { Solicitud } from '@Entities/solicitud.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  controllers: [SalasController],
  providers: [SalasService],
})
export class SalasModule {}
