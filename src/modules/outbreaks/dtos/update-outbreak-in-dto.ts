import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOutbreakInDto {
  @ApiPropertyOptional({ example: 1 })
  plantId?: number;

  @ApiPropertyOptional({ example: 1 })
  diseaseId?: number;

  @ApiPropertyOptional({ example: '2026-10-07', description: 'Formato YYYY-MM-DD, no posterior a hoy' })
  reportDate?: string;

  @ApiPropertyOptional({ example: 'Huila', maxLength: 100 })
  region?: string;

  @ApiPropertyOptional({ example: 12.5, description: 'Número mayor que 0' })
  affectedHectares?: number;
}