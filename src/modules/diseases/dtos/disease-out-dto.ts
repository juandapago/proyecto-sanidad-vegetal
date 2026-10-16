import { ApiProperty } from '@nestjs/swagger';
import { RiskSeason } from '../enums/risk-season.enum.js';

export class DiseaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symptoms: string;

  @ApiProperty({ enum: RiskSeason })
  riskSeason: RiskSeason;

  @ApiProperty()
  pathogenId: number;
}