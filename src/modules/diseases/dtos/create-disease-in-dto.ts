import { ApiProperty } from '@nestjs/swagger';
import { RiskSeason } from '../enums/risk-season.enum.js';

export class CreateDiseaseInDto {
  @ApiProperty({ example: 'Roya del café', maxLength: 100 })
  name: string;

  @ApiProperty({ example: 'Manchas amarillas en el envés de la hoja que se vuelven polvo naranja' })
  symptoms: string;

  @ApiProperty({ enum: RiskSeason, example: RiskSeason.TODO_EL_ANO })
  riskSeason: RiskSeason;

  @ApiProperty({ example: 1, description: 'Id de un patógeno que ya exista' })
  pathogenId: number;
}