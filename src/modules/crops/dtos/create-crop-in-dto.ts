import { ApiProperty } from '@nestjs/swagger';

export class CreateCropInDto {
  @ApiProperty({ example: 1, description: 'Id de una planta existente' })
  plantId: number;

  @ApiProperty({ example: 'Lote 3 - Finca La Esperanza', maxLength: 100 })
  lot: string;

  @ApiProperty({ example: 'Caldas', maxLength: 100 })
  region: string;

  @ApiProperty({ example: '2026-03-15', description: 'Formato YYYY-MM-DD, no posterior a hoy' })
  sowingDate: string;

  @ApiProperty({ example: 'ACGTACGTACGTACGTACGT', description: 'Solo A, C, G y T en mayúscula' })
  seedGeneticCode: string;
}