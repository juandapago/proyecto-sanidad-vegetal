import { ApiProperty } from '@nestjs/swagger';
import { PathogenOutDto } from './pathogen-out-dto.js';
import { DiseaseOutDto } from '../../diseases/dtos/disease-out-dto.js';

export class PathogenDiseasesOutDto {
  @ApiProperty({ type: PathogenOutDto })
  pathogen: PathogenOutDto;

  @ApiProperty()
  totalDiseases: number;

  @ApiProperty({ type: DiseaseOutDto, isArray: true })
  diseases: DiseaseOutDto[];
}