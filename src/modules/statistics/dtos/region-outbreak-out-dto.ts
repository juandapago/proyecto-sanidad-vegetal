import { ApiProperty } from '@nestjs/swagger';

export class TopDiseaseOutDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Roya del café' })
  name: string;

  @ApiProperty({ example: 3, description: 'Brotes de esta enfermedad en la región' })
  outbreaks: number;
}

export class RegionOutbreakOutDto {
  @ApiProperty({ example: 'Antioquia' })
  region: string;

  @ApiProperty({ example: 7, description: 'Número de brotes en la región' })
  outbreaks: number;

  @ApiProperty({ example: 85.5, description: 'Hectáreas afectadas en total' })
  hectares: number;

  @ApiProperty({ type: TopDiseaseOutDto, description: 'Enfermedad con más brotes en la región' })
  mostFrequentDisease: TopDiseaseOutDto;
}