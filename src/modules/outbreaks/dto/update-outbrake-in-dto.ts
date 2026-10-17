import {ApiPropertyOptional} from '@nestjs/swagger';
export class UpdateOutbreakInDto {
    @ApiPropertyOptional({ example: 3, description: 'ID de la planta'})
    plantId?: number;

    @ApiPropertyOptional({ example: 1, description: 'ID de la enfermedad' })
    diseaseId?: number;

    @ApiPropertyOptional({ example: '2023-06-15', description: 'Fecha del brote' })
    reportDate?: Date;

    @ApiPropertyOptional({ example: 'Andalucía', description: 'Región del brote' })
    region?: string;

    @ApiPropertyOptional({ example: 12.5, description: 'Hectáreas afectadas' })
    affectedHectares?: number;
}