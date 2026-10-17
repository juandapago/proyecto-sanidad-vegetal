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
import type { OutbreaksServiceInterface } from './outbreaks-service-interface.js';
import { OUTBREAKS_SERVICE } from './token.js';
import { CreateOutbreakInDto } from './dtos/create-outbreak-in-dto.js';
import { UpdateOutbreakInDto } from './dtos/update-outbreak-in-dto.js';
import { OutbreakOutDto } from './dtos/outbreak-out-dto.js';
import { parseId } from '../../common/validators.js';
import { validateCreateOutbreak, validateOutbreakFilters, validateUpdateOutbreak } from './outbreak-validator.js';

@ApiTags('outbreaks')
@Controller('outbreaks')
export class OutbreaksController {
  constructor(
    @Inject(OUTBREAKS_SERVICE)
    private readonly outbreaksService: OutbreaksServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar brotes, con filtros opcionales y combinables' })
  @ApiQuery({ name: 'plantId', required: false, type: Number })
  @ApiQuery({ name: 'diseaseId', required: false, type: Number })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha de reporte desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha de reporte hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'minHectares', required: false, type: Number, description: 'Hectáreas afectadas mínimas' })
  @ApiOkResponse({ type: OutbreakOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('plantId') plantId?: string,
    @Query('diseaseId') diseaseId?: string,
    @Query('region') region?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('minHectares') minHectares?: string,
  ) {
    const filters = validateOutbreakFilters(plantId, diseaseId, region, from, to, minHectares);
    return this.outbreaksService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un brote por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: OutbreakOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe un brote con ese id' })
  findOne(@Param('id') id: string) {
    return this.outbreaksService.findOne(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un brote' })
  @ApiBody({ type: CreateOutbreakInDto })
  @ApiCreatedResponse({ type: OutbreakOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo, la fecha es inválida o futura, o las hectáreas no son mayores que 0' })
  @ApiNotFoundResponse({ description: 'La planta o la enfermedad no existen' })
  create(@Body() body: CreateOutbreakInDto) {
    const dto = validateCreateOutbreak(body);
    return this.outbreaksService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de un brote' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOutbreakInDto })
  @ApiOkResponse({ type: OutbreakOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe el brote, la planta o la enfermedad' })
  update(@Param('id') id: string, @Body() body: UpdateOutbreakInDto) {
    const outbreakId = parseId(id);
    const dto = validateUpdateOutbreak(body);
    return this.outbreaksService.update(outbreakId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un brote' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Brote eliminado' })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe un brote con ese id' })
  remove(@Param('id') id: string) {
    return this.outbreaksService.remove(parseId(id));
  }
}