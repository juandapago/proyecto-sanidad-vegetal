import { ApiProperty } from '@nestjs/swagger';

export class CropOutDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  plantId: number;

  @ApiProperty({ example: 'Lote 3 - Finca La Esperanza' })
  lot: string;

  @ApiProperty({ example: 'Caldas' })
  region: string;

  @ApiProperty({ example: '2026-03-15' })
  sowingDate: string;

  @ApiProperty({ example: 'ACGTACGTACGTACGTACGT' })
  seedGeneticCode: string;
}