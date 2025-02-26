import { Module } from '@nestjs/common';
import { DatabaseModule } from '@Common/Database/Database.module';
import { SolicitudModule } from './Modules/Solicitud/solicitud.module';
import { SalasModule } from './Modules/Salas/salas.module';
import { AuthModule } from './Modules/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule, SolicitudModule, SalasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
