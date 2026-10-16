import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { TreatmentsServiceInterface } from './treatments-service-interface.js';
import { TREATMENTS_SERVICE } from './token.js';
import { CreateTreatmentInDto } from './dtos/create-treatment-in-dto.js';
import { UpdateTreatmentInDto } from './dtos/update-treatment-in-dto.js';
import { TreatmentOutDto } from './dtos/treatment-out-dto.js';
import { TreatmentType } from './enums/treatment-type.enum.js';
import { parseId } from '../../common/validators.js';
import { validateCreateTreatment, validateTreatmentFilters, validateUpdateTreatment } from './treatment-validator.js';

@ApiTags('treatments')
@Controller('treatments')
export class TreatmentsController {
  constructor(
    @Inject(TREATMENTS_SERVICE)
    private readonly treatmentsService: TreatmentsServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar tratamientos, con filtros opcionales' })
  @ApiQuery({ name: 'name', required: false, description: 'Busca por parte del nombre' })
  @ApiQuery({ name: 'treatmentType', required: false, enum: TreatmentType })
  @ApiQuery({ name: 'diseaseId', required: false, type: Number })
  @ApiOkResponse({ type: TreatmentOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('name') name?: string,
    @Query('treatmentType') treatmentType?: string,
    @Query('diseaseId') diseaseId?: string,
  ) {
    const filters = validateTreatmentFilters(name, treatmentType, diseaseId);
    return this.treatmentsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tratamiento por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TreatmentOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe un tratamiento con ese id' })
  findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un tratamiento para una enfermedad existente' })
  @ApiBody({ type: CreateTreatmentInDto })
  @ApiCreatedResponse({ type: TreatmentOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo, está vacío o tiene un valor inválido' })
  @ApiNotFoundResponse({ description: 'La enfermedad indicada no existe' })
  create(@Body() body: CreateTreatmentInDto) {
    const dto = validateCreateTreatment(body);
    return this.treatmentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de un tratamiento' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTreatmentInDto })
  @ApiOkResponse({ type: TreatmentOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe el tratamiento o la enfermedad indicada' })
  update(@Param('id') id: string, @Body() body: UpdateTreatmentInDto) {
    const treatmentId = parseId(id);
    const dto = validateUpdateTreatment(body);
    return this.treatmentsService.update(treatmentId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un tratamiento' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Tratamiento eliminado' })
  @ApiNotFoundResponse({ description: 'No existe un tratamiento con ese id' })
  remove(@Param('id') id: string) {
    return this.treatmentsService.remove(parseId(id));
  }
}