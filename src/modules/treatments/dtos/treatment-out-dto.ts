import { ApiProperty } from '@nestjs/swagger';
import { TreatmentType } from '../enums/treatment-type.enum.js';

export class TreatmentOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  applicationDescription: string;

  @ApiProperty({ enum: TreatmentType })
  treatmentType: TreatmentType;

  @ApiProperty()
  diseaseId: number;
}