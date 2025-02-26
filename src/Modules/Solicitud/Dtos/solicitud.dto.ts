import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  IsNumber,
} from 'class-validator';

export class SolicitudDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'El Numero de asistentes debe ser mayor a 1' })
  @Max(40, { message: 'El número de asistentes no debe superar 40.' })
  assistants: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purpose: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fecha_reserva: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ministry: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_user: number;

  @ApiProperty({ required: false })
  additionalEquipment: string[];
}
