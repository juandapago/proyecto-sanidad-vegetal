import { ApiProperty } from '@nestjs/swagger';
import { PathogenType } from '../enums/pathogen-type.enum.js';

export class CreatePathogenInDto {
  @ApiProperty({ example: 'Roya del café', maxLength: 100 })
  name: string;

  @ApiProperty({ example: 'Hemileia vastatrix', maxLength: 150 })
  scientificName: string;

  @ApiProperty({ enum: PathogenType, example: PathogenType.HONGO })
  pathogenType: PathogenType;

  @ApiProperty({ example: 'viento', maxLength: 100 })
  transmissionMode: string;

  @ApiProperty({ example: 'ACGTTGCAACGT', description: 'Solo A, C, G y T en mayúscula' })
  geneticSequence: string;
}