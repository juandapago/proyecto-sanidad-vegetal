import { ApiProperty } from '@nestjs/swagger';
import { CropType } from '../enums/crop-type.enum.js';

export class CreatePlantInDto {
  @ApiProperty({ example: 'Tomate', maxLength: 100 })
  commonName: string;

  @ApiProperty({ example: 'Solanum lycopersicum', maxLength: 150, description: 'No se puede repetir' })
  scientificName: string;

  @ApiProperty({ example: 'Solanaceae', maxLength: 100 })
  botanicalFamily: string;

  @ApiProperty({ enum: CropType, example: CropType.HORTALIZA })
  cropType: CropType;

  @ApiProperty({ example: 'ACGTACGTACGTACGTACGT', pattern: '^[ACGT]+$', description: 'Solo A, C, G y T en mayúscula' })
  geneticSequence: string;
}