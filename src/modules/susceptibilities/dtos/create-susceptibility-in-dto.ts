import { ApiProperty } from '@nestjs/swagger';
import { SusceptibilityLevel } from '../enums/susceptibility-level.enum.js';

export class CreateSusceptibilityInDto {
  @ApiProperty({ example: 1, description: 'Id de una planta existente' })
  plantId: number;

  @ApiProperty({ example: 1, description: 'Id de una enfermedad existente' })
  diseaseId: number;

  @ApiProperty({ enum: SusceptibilityLevel, example: SusceptibilityLevel.ALTA })
  level: SusceptibilityLevel;
}