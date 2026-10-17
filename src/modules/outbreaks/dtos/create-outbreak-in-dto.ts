import { ApiProperty } from '@nestjs/swagger';

export class CreateOutbreakInDto {
  @ApiProperty({ example: 1, description: 'Id de una planta existente' })
  plantId: number;

  @ApiProperty({ example: 1, description: 'Id de una enfermedad existente' })
  diseaseId: number;

  @ApiProperty({ example: '2026-10-07', description: 'Formato YYYY-MM-DD, no posterior a hoy' })
  reportDate: string;

  @ApiProperty({ example: 'Huila', maxLength: 100 })
  region: string;

  @ApiProperty({ example: 12.5, description: 'Número mayor que 0' })
  affectedHectares: number;
}