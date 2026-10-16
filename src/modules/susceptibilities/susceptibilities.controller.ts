import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { SusceptibilitiesServiceInterface } from './susceptibilities-service-interface.js';
import { SUSCEPTIBILITIES_SERVICE } from './token.js';
import { CreateSusceptibilityInDto } from './dtos/create-susceptibility-in-dto.js';
import { UpdateSusceptibilityInDto } from './dtos/update-susceptibility-in-dto.js';
import { SusceptibilityOutDto } from './dtos/susceptibility-out-dto.js';
import { SusceptibilityLevel } from './enums/susceptibility-level.enum.js';
import { parseId } from '../../common/validators.js';
import {
  validateCreateSusceptibility,
  validateSusceptibilityFilters,
  validateUpdateSusceptibility,
} from './susceptibility-validator.js';

@ApiTags('susceptibilities')
@Controller('susceptibilities')
export class SusceptibilitiesController {
  constructor(
    @Inject(SUSCEPTIBILITIES_SERVICE)
    private readonly susceptibilitiesService: SusceptibilitiesServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar susceptibilidades, con filtros opcionales' })
  @ApiQuery({ name: 'plantId', required: false, type: Number })
  @ApiQuery({ name: 'diseaseId', required: false, type: Number })
  @ApiQuery({ name: 'level', required: false, enum: SusceptibilityLevel })
  @ApiOkResponse({ type: SusceptibilityOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('plantId') plantId?: string,
    @Query('diseaseId') diseaseId?: string,
    @Query('level') level?: string,
  ) {
    const filters = validateSusceptibilityFilters(plantId, diseaseId, level);
    return this.susceptibilitiesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una susceptibilidad por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: SusceptibilityOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe una susceptibilidad con ese id' })
  findOne(@Param('id') id: string) {
    return this.susceptibilitiesService.findOne(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar qué tan susceptible es una planta a una enfermedad' })
  @ApiBody({ type: CreateSusceptibilityInDto })
  @ApiCreatedResponse({ type: SusceptibilityOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo o tiene un valor inválido' })
  @ApiNotFoundResponse({ description: 'La planta o la enfermedad no existe' })
  @ApiConflictResponse({ description: 'Ya existe una susceptibilidad para esa planta y enfermedad' })
  create(@Body() body: CreateSusceptibilityInDto) {
    const dto = validateCreateSusceptibility(body);
    return this.susceptibilitiesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de una susceptibilidad' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateSusceptibilityInDto })
  @ApiOkResponse({ type: SusceptibilityOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe la susceptibilidad, la planta o la enfermedad' })
  @ApiConflictResponse({ description: 'Ya existe otra susceptibilidad para esa planta y enfermedad' })
  update(@Param('id') id: string, @Body() body: UpdateSusceptibilityInDto) {
    const susceptibilityId = parseId(id);
    const dto = validateUpdateSusceptibility(body);
    return this.susceptibilitiesService.update(susceptibilityId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una susceptibilidad' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Susceptibilidad eliminada' })
  @ApiNotFoundResponse({ description: 'No existe una susceptibilidad con ese id' })
  remove(@Param('id') id: string) {
    return this.susceptibilitiesService.remove(parseId(id));
  }
}