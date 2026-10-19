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
import type { DiseasesServiceInterface } from './diseases-service-interface.js';
import { DISEASES_SERVICE } from './token.js';
import { CreateDiseaseInDto } from './dtos/create-disease-in-dto.js';
import { UpdateDiseaseInDto } from './dtos/update-disease-in-dto.js';
import { DiseaseOutDto } from './dtos/disease-out-dto.js';
import { DiseaseDetailsOutDto } from './dtos/disease-details-out-dto.js';
import { RiskSeason } from './enums/risk-season.enum.js';
import { parseId } from '../../common/validators.js';
import { validateCreateDisease, validateDiseaseFilters, validateUpdateDisease } from './disease-validator.js';

@ApiTags('diseases')
@Controller('diseases')
export class DiseasesController {
  constructor(
    @Inject(DISEASES_SERVICE)
    private readonly diseasesService: DiseasesServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar enfermedades, con filtros opcionales' })
  @ApiQuery({ name: 'name', required: false, description: 'Busca por parte del nombre' })
  @ApiQuery({ name: 'riskSeason', required: false, enum: RiskSeason })
  @ApiQuery({ name: 'pathogenId', required: false, type: Number })
  @ApiOkResponse({ type: DiseaseOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('name') name?: string,
    @Query('riskSeason') riskSeason?: string,
    @Query('pathogenId') pathogenId?: string,
  ) {
    const filters = validateDiseaseFilters(name, riskSeason, pathogenId);
    return this.diseasesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una enfermedad por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DiseaseOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe una enfermedad con ese id' })
  findOne(@Param('id') id: string) {
    return this.diseasesService.findOne(parseId(id));
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Ficha completa de una enfermedad: patógeno, tratamientos, plantas afectadas y brotes' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DiseaseDetailsOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe una enfermedad con ese id' })
  findDetails(@Param('id') id: string) {
    return this.diseasesService.findDetails(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una enfermedad causada por un patógeno existente' })
  @ApiBody({ type: CreateDiseaseInDto })
  @ApiCreatedResponse({ type: DiseaseOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo, está vacío o tiene un valor inválido' })
  @ApiNotFoundResponse({ description: 'El patógeno indicado no existe' })
  @ApiConflictResponse({ description: 'Ya existe una enfermedad con ese nombre' })
  create(@Body() body: CreateDiseaseInDto) {
    const dto = validateCreateDisease(body);
    return this.diseasesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de una enfermedad' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDiseaseInDto })
  @ApiOkResponse({ type: DiseaseOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe la enfermedad o el patógeno indicado' })
  @ApiConflictResponse({ description: 'Ya existe otra enfermedad con ese nombre' })
  update(@Param('id') id: string, @Body() body: UpdateDiseaseInDto) {
    const diseaseId = parseId(id);
    const dto = validateUpdateDisease(body);
    return this.diseasesService.update(diseaseId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una enfermedad' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Enfermedad eliminada' })
  @ApiNotFoundResponse({ description: 'No existe una enfermedad con ese id' })
  @ApiConflictResponse({ description: 'Tiene tratamientos, susceptibilidades o brotes asociados' })
  remove(@Param('id') id: string) {
    return this.diseasesService.remove(parseId(id));
  }
}