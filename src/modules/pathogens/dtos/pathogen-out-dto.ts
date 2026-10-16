import { ApiProperty } from '@nestjs/swagger';
import { PathogenType } from '../enums/pathogen-type.enum.js';

export class PathogenOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  scientificName: string;

  @ApiProperty({ enum: PathogenType })
  pathogenType: PathogenType;

  @ApiProperty()
  transmissionMode: string;

  @ApiProperty()
  geneticSequence: string;
}