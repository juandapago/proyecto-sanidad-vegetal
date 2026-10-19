import { ApiProperty } from '@nestjs/swagger';

export class OutbreakSummaryOutDto {
  @ApiProperty({ example: 42, description: 'Total de brotes en el período' })
  totalOutbreaks: number;

  @ApiProperty({ example: 520.75, description: 'Total de hectáreas afectadas en el período' })
  totalHectares: number;
}
