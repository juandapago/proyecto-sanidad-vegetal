import { ApiPropertyOptional } from '@nestjs/swagger';
import { SusceptibilityLevel } from '../enums/susceptibility-level.enum.js';

export class UpdateSusceptibilityInDto {
  @ApiPropertyOptional({ example: 1 })
  plantId?: number;

  @ApiPropertyOptional({ example: 1 })
  diseaseId?: number;

  @ApiPropertyOptional({ enum: SusceptibilityLevel, example: SusceptibilityLevel.MEDIA })
  level?: SusceptibilityLevel;
}