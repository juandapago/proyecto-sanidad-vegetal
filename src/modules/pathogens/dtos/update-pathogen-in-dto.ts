import { ApiPropertyOptional } from '@nestjs/swagger';
import { PathogenType } from '../enums/pathogen-type.enum.js';

export class UpdatePathogenInDto {
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @ApiPropertyOptional({ maxLength: 150 })
  scientificName?: string;

  @ApiPropertyOptional({ enum: PathogenType })
  pathogenType?: PathogenType;

  @ApiPropertyOptional({ maxLength: 100 })
  transmissionMode?: string;

  @ApiPropertyOptional({ description: 'Solo A, C, G y T en mayúscula' })
  geneticSequence?: string;
}