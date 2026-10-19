import { ApiPropertyOptional } from '@nestjs/swagger';
import { CropType } from '../enums/crop-type.enum.js';

// PATCH: todos los campos son opcionales, pero debe llegar al menos uno.
export class UpdatePlantInDto {
  @ApiPropertyOptional({ example: 'Tomate chonto', maxLength: 100 })
  commonName?: string;

  @ApiPropertyOptional({ example: 'Solanum lycopersicum', maxLength: 150 })
  scientificName?: string;

  @ApiPropertyOptional({ example: 'Solanaceae', maxLength: 100 })
  botanicalFamily?: string;

  @ApiPropertyOptional({ enum: CropType, example: CropType.FRUTAL })
  cropType?: CropType;

  @ApiPropertyOptional({ example: 'ACGTACGTACGTACGTACGT', pattern: '^[ACGT]+$' })
  geneticSequence?: string;
}