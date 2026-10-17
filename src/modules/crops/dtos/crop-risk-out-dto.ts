import { ApiProperty } from '@nestjs/swagger';
import { CropOutDto } from './crop-out-dto.js';
import { CropRiskDiseaseOutDto } from './crop-risk-disease-out-dto.js';
import { PlantOutDto } from '../../plants/dtos/plant-out-dto.js';

export class CropRiskOutDto {
  @ApiProperty({ type: CropOutDto })
  crop: CropOutDto;

  @ApiProperty({ type: PlantOutDto })
  plant: PlantOutDto;

  @ApiProperty({ example: '2025-10-17', description: 'Fecha desde la que un brote se considera reciente (últimos 12 meses)' })
  recentSince: string;

  @ApiProperty({ type: [CropRiskDiseaseOutDto], description: 'Enfermedades a las que la planta tiene susceptibilidad alta' })
  riskDiseases: CropRiskDiseaseOutDto[];

  @ApiProperty({ example: 3, description: 'Total de brotes recientes en la región del cultivo, sumando todas las enfermedades de riesgo' })
  totalRecentOutbreaks: number;
}