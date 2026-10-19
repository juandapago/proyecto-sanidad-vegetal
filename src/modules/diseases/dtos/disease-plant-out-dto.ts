import { ApiProperty } from '@nestjs/swagger';
import { SusceptibilityLevel } from '../../susceptibilities/enums/susceptibility-level.enum.js';

export class DiseasePlantOutDto {
  @ApiProperty()
  plantId: number;

  @ApiProperty()
  commonName: string;

  @ApiProperty()
  scientificName: string;

  @ApiProperty({ enum: SusceptibilityLevel })
  susceptibilityLevel: SusceptibilityLevel;
}