import {ApiProperty} from '@nestjs/swagger';

export class OutbreakOutDto {
    @ApiProperty({ example: 1, description: 'ID del brote' })
    id: number;

    @ApiProperty({ example: 3, description: 'ID de la planta' })
    plantId: number;

    @ApiProperty({ example: 1, description: 'ID de la enfermedad' })
    diseaseId: number;

    @ApiProperty({ example: '2023-06-15', description: 'Fecha del brote' })
    reportDate: String;

    @ApiProperty({ example: 'Andalucía', description: 'Región del brote' })
    region: string;

    @ApiProperty({ example: 12.5, description: 'Hectáreas afectadas' })
    affectedHectares: number;
}