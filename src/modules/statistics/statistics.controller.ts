import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { StatisticsServiceInterface } from './statistics-service-interface.js';
import { STATISTICS_SERVICE } from './token.js';
import { OutbreakGroupOutDto } from './dtos/outbreak-group-out-dto.js';
import { RegionOutbreakOutDto } from './dtos/region-outbreak-out-dto.js';
import { validateStatisticsFilters } from './statistics-validator.js';

@ApiTags('statistics')
@Controller('statistics/outbreaks')
export class StatisticsController {
  constructor(
    @Inject(STATISTICS_SERVICE)
    private readonly statisticsService: StatisticsServiceInterface,
  ) {}

  @Get('by-disease')
  @ApiOperation({ summary: 'Brotes y hectáreas afectadas por enfermedad, de mayor a menor' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha de reporte desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha de reporte hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Solo las primeras N filas (top)' })
  @ApiOkResponse({ type: OutbreakGroupOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Alguna fecha o el límite son inválidos' })
  byDisease(@Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string) {
    return this.statisticsService.byDisease(validateStatisticsFilters(from, to, limit));
  }

  @Get('by-plant')
  @ApiOperation({ summary: 'Brotes y hectáreas afectadas por planta, de mayor a menor' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha de reporte desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha de reporte hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Solo las primeras N filas (top)' })
  @ApiOkResponse({ type: OutbreakGroupOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Alguna fecha o el límite son inválidos' })
  byPlant(@Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string) {
    return this.statisticsService.byPlant(validateStatisticsFilters(from, to, limit));
  }

  @Get('by-pathogen')
  @ApiOperation({ summary: 'Brotes y hectáreas afectadas por patógeno (suma de sus enfermedades), de mayor a menor' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha de reporte desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha de reporte hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Solo las primeras N filas (top)' })
  @ApiOkResponse({ type: OutbreakGroupOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Alguna fecha o el límite son inválidos' })
  byPathogen(@Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string) {
    return this.statisticsService.byPathogen(validateStatisticsFilters(from, to, limit));
  }

  @Get('by-region')
  @ApiOperation({ summary: 'Brotes, hectáreas y enfermedad más frecuente por región, de mayor a menor' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha de reporte desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha de reporte hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Solo las primeras N regiones (top)' })
  @ApiOkResponse({ type: RegionOutbreakOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Alguna fecha o el límite son inválidos' })
  byRegion(@Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string) {
    return this.statisticsService.byRegion(validateStatisticsFilters(from, to, limit));
  }
}