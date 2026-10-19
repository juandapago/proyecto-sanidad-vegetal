import { ApiProperty } from '@nestjs/swagger';

export class OutbreakGroupOutDto {
  @ApiProperty({ example: 1, description: 'Id de la enfermedad, planta o patógeno agrupado' })
  id: number;

  @ApiProperty({ example: 'Roya del café' })
  name: string;

  @ApiProperty({ example: 4, description: 'Número de brotes' })
  outbreaks: number;

  @ApiProperty({ example: 52.5, description: 'Hectáreas afectadas en total' })
  hectares: number;
}