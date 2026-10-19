import { ApiProperty } from '@nestjs/swagger';
import { PlantOutDto } from './plant-out-dto.js';
import { PlantDiseaseOutDto } from './plant-disease-out-dto.js';

export class PlantDiseasesOutDto {
  @ApiProperty({ type: PlantOutDto })
  plant: PlantOutDto;

  @ApiProperty({ type: [PlantDiseaseOutDto] })
  diseases: PlantDiseaseOutDto[];
}
