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
import type { PlantsServiceInterface } from './plants-service-interface.js';
import { PLANTS_SERVICE } from './token.js';
import { CreatePlantInDto } from './dtos/create-plant-in-dto.js';
import { UpdatePlantInDto } from './dtos/update-plant-in-dto.js';
import { PlantOutDto } from './dtos/plant-out-dto.js';
import { PlantDiseasesOutDto } from './dtos/plant-diseases-out-dto.js';
import { CropType } from './enums/crop-type.enum.js';
import { SusceptibilityLevel } from '../susceptibilities/enums/susceptibility-level.enum.js';
import { parseId } from '../../common/validators.js';
import {
  validateCreatePlant,
  validatePlantDiseasesLevel,
  validatePlantFilters,
  validateUpdatePlant,
} from './plant-validator.js';

@ApiTags('plants')
@Controller('plants')
export class PlantsController {
  constructor(
    @Inject(PLANTS_SERVICE)
    private readonly plantsService: PlantsServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar plantas, con filtros opcionales' })
  @ApiQuery({ name: 'name', required: false, description: 'Busca en el nombre común o científico' })
  @ApiQuery({ name: 'cropType', required: false, enum: CropType })
  @ApiQuery({ name: 'botanicalFamily', required: false })
  @ApiOkResponse({ type: PlantOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('name') name?: string,
    @Query('cropType') cropType?: string,
    @Query('botanicalFamily') botanicalFamily?: string,
  ) {
    const filters = validatePlantFilters(name, cropType, botanicalFamily);
    return this.plantsService.findAll(filters);
  }

  @Get(':id/diseases')
  @ApiOperation({ summary: 'Enfermedades que afectan a una planta, con su nivel de susceptibilidad y sus tratamientos' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'level', required: false, enum: SusceptibilityLevel, description: 'Filtra por nivel de susceptibilidad' })
  @ApiOkResponse({ type: PlantDiseasesOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo o el nivel no es válido' })
  @ApiNotFoundResponse({ description: 'No existe una planta con ese id' })
  findDiseases(@Param('id') id: string, @Query('level') level?: string) {
    const plantId = parseId(id);
    const susceptibilityLevel = validatePlantDiseasesLevel(level);
    return this.plantsService.findDiseases(plantId, susceptibilityLevel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una planta por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PlantOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe una planta con ese id' })
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una planta' })
  @ApiBody({ type: CreatePlantInDto })
  @ApiCreatedResponse({ type: PlantOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo, está vacío o tiene un valor inválido' })
  @ApiConflictResponse({ description: 'Ya existe una planta con ese nombre científico' })
  create(@Body() body: CreatePlantInDto) {
    const dto = validateCreatePlant(body);
    return this.plantsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de una planta' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePlantInDto })
  @ApiOkResponse({ type: PlantOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe una planta con ese id' })
  @ApiConflictResponse({ description: 'Ya existe otra planta con ese nombre científico' })
  update(@Param('id') id: string, @Body() body: UpdatePlantInDto) {
    const plantId = parseId(id);
    const dto = validateUpdatePlant(body);
    return this.plantsService.update(plantId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una planta' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Planta eliminada' })
  @ApiNotFoundResponse({ description: 'No existe una planta con ese id' })
  @ApiConflictResponse({ description: 'Tiene susceptibilidades, cultivos o brotes registrados' })
  remove(@Param('id') id: string) {
    return this.plantsService.remove(parseId(id));
  }
}
