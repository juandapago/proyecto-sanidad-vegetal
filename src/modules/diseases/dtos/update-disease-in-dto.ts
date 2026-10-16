import { ApiPropertyOptional } from '@nestjs/swagger';
import { RiskSeason } from '../enums/risk-season.enum.js';

export class UpdateDiseaseInDto {
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @ApiPropertyOptional()
  symptoms?: string;

  @ApiPropertyOptional({ enum: RiskSeason })
  riskSeason?: RiskSeason;

  @ApiPropertyOptional({ description: 'Id de un patógeno que ya exista' })
  pathogenId?: number;
}