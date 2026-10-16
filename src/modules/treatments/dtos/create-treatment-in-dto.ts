import { ApiProperty } from '@nestjs/swagger';
import { TreatmentType } from '../enums/treatment-type.enum.js';

export class CreateTreatmentInDto {
  @ApiProperty({ example: 'Fungicida cúprico', maxLength: 100 })
  name: string;

  @ApiProperty({ example: 'Aplicar oxicloruro de cobre cada 30 días en época de lluvias, cubriendo el envés de las hojas' })
  applicationDescription: string;

  @ApiProperty({ enum: TreatmentType, example: TreatmentType.QUIMICO })
  treatmentType: TreatmentType;

  @ApiProperty({ example: 1, description: 'Id de una enfermedad que ya exista' })
  diseaseId: number;
}