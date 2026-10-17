import { ApiProperty } from '@nestjs/swagger';
import { DiseaseOutDto } from '../../diseases/dtos/disease-out-dto.js';
import { OutbreakOutDto } from '../../outbreaks/dtos/outbreak-out-dto.js';

export class CropRiskDiseaseOutDto {
  @ApiProperty({ type: DiseaseOutDto })
  disease: DiseaseOutDto;

  @ApiProperty({ type: [OutbreakOutDto], description: 'Brotes recientes de esta enfermedad en la misma región del cultivo' })
  recentOutbreaks: OutbreakOutDto[];
}