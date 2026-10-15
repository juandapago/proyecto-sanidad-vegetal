import { ApiProperty } from '@nestjs/swagger';
import { CropType } from '../enums/crop-type.enum.js';

export class PlantOutDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tomate' })
  commonName: string;

  @ApiProperty({ example: 'Solanum lycopersicum' })
  scientificName: string;

  @ApiProperty({ example: 'Solanaceae' })
  botanicalFamily: string;

  @ApiProperty({ enum: CropType, example: CropType.HORTALIZA })
  cropType: CropType;

  @ApiProperty({ example: 'ACGTACGTACGTACGTACGT' })
  geneticSequence: string;
}