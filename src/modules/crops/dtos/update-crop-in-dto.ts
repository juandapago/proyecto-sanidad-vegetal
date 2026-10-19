import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCropInDto {
  @ApiPropertyOptional({ example: 1 })
  plantId?: number;

  @ApiPropertyOptional({ maxLength: 100 })
  lot?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  region?: string;

  @ApiPropertyOptional({ example: '2026-03-15' })
  sowingDate?: string;

  @ApiPropertyOptional({ description: 'Solo A, C, G y T en mayúscula' })
  seedGeneticCode?: string;
}