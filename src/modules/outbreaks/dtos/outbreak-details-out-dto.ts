import { ApiProperty } from '@nestjs/swagger';
import { OutbreakOutDto } from './outbreak-out-dto.js';
import { PlantOutDto } from '../../plants/dtos/plant-out-dto.js';
import { DiseaseOutDto } from '../../diseases/dtos/disease-out-dto.js';
import { PathogenOutDto } from '../../pathogens/dtos/pathogen-out-dto.js';
import { TreatmentOutDto } from '../../treatments/dtos/treatment-out-dto.js';

export class OutbreakDetailsOutDto {
  @ApiProperty({ type: OutbreakOutDto })
  outbreak: OutbreakOutDto;

  @ApiProperty({ type: PlantOutDto })
  plant: PlantOutDto;

  @ApiProperty({ type: DiseaseOutDto })
  disease: DiseaseOutDto;

  @ApiProperty({ type: PathogenOutDto })
  pathogen: PathogenOutDto;

  @ApiProperty({ type: [TreatmentOutDto] })
  treatments: TreatmentOutDto[];
}