import { ApiProperty } from '@nestjs/swagger';

export class MutationCheckOutDto {
  @ApiProperty({ example: 1 })
  cropId: number;

  @ApiProperty({ example: 1 })
  plantId: number;

  @ApiProperty({ example: 'Solanum lycopersicum' })
  plantScientificName: string;

  @ApiProperty({ example: 20, description: 'Cantidad de letras comparadas' })
  sequenceLength: number;

  @ApiProperty({ example: 3, description: 'Posiciones donde la semilla es distinta a la referencia' })
  mutations: number;

  @ApiProperty({ example: [4, 11, 17], type: [Number], description: 'Posiciones con mutación, contando desde 1' })
  mutatedPositions: number[];

  @ApiProperty({ example: 85, description: 'Porcentaje de letras iguales' })
  similarityPercentage: number;
}