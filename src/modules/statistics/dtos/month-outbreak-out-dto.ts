import { ApiProperty } from '@nestjs/swagger';

export class MonthOutbreakOutDto {
  @ApiProperty({ example: '2024-03', description: 'Mes en formato YYYY-MM' })
  month: string;

  @ApiProperty({ example: 7, description: 'Número de brotes reportados en el mes' })
  outbreaks: number;

  @ApiProperty({ example: 85.5, description: 'Hectáreas afectadas en total' })
  hectares: number;

  @ApiProperty({ example: 5, description: 'Brotes en época de riesgo de su enfermedad (todo_el_ano siempre cuenta)' })
  outbreaksInRiskSeason: number;
}
