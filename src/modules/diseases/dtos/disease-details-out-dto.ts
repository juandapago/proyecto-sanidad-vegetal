import { ApiProperty } from '@nestjs/swagger';
import { DiseaseOutDto } from './disease-out-dto.js';
import { DiseasePlantOutDto } from './disease-plant-out-dto.js';
import { PathogenOutDto } from '../../pathogens/dtos/pathogen-out-dto.js';
import { TreatmentOutDto } from '../../treatments/dtos/treatment-out-dto.js';

export class DiseaseDetailsOutDto {
  @ApiProperty({ type: DiseaseOutDto })
  disease: DiseaseOutDto;

  @ApiProperty({ type: PathogenOutDto })
  pathogen: PathogenOutDto;

  @ApiProperty({ type: TreatmentOutDto, isArray: true })
  treatments: TreatmentOutDto[];

  @ApiProperty({ type: DiseasePlantOutDto, isArray: true })
  affectedPlants: DiseasePlantOutDto[];

  @ApiProperty()
  totalOutbreaks: number;

  @ApiProperty()
  totalAffectedHectares: number;
}