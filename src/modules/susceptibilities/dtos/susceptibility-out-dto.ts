import { ApiProperty } from '@nestjs/swagger';
import { SusceptibilityLevel } from '../enums/susceptibility-level.enum.js';

export class SusceptibilityOutDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  plantId: number;

  @ApiProperty({ example: 1 })
  diseaseId: number;

  @ApiProperty({ enum: SusceptibilityLevel, example: SusceptibilityLevel.ALTA })
  level: SusceptibilityLevel;
}