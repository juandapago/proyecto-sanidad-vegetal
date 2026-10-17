import { ApiProperty } from '@nestjs/swagger';
import { RiskSeason } from '../../diseases/enums/risk-season.enum.js';
import { SusceptibilityLevel } from '../../susceptibilities/enums/susceptibility-level.enum.js';
import { TreatmentOutDto } from '../../treatments/dtos/treatment-out-dto.js';

export class PlantDiseaseOutDto {
  @ApiProperty({ example: 1 })
  diseaseId: number;

  @ApiProperty({ example: 'Tizón tardío del tomate' })
  name: string;

  @ApiProperty({ example: 'Manchas oscuras en hojas y tallos' })
  symptoms: string;

  @ApiProperty({ enum: RiskSeason, example: RiskSeason.INVIERNO })
  riskSeason: RiskSeason;

  @ApiProperty({ enum: SusceptibilityLevel, example: SusceptibilityLevel.ALTA })
  susceptibilityLevel: SusceptibilityLevel;

  @ApiProperty({ type: [TreatmentOutDto] })
  treatments: TreatmentOutDto[];
}
