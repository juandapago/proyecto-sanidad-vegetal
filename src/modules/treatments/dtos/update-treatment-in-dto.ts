import { ApiPropertyOptional } from '@nestjs/swagger';
import { TreatmentType } from '../enums/treatment-type.enum.js';

export class UpdateTreatmentInDto {
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @ApiPropertyOptional()
  applicationDescription?: string;

  @ApiPropertyOptional({ enum: TreatmentType })
  treatmentType?: TreatmentType;

  @ApiPropertyOptional({ description: 'Id de una enfermedad que ya exista' })
  diseaseId?: number;
}