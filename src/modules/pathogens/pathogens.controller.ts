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
import type { PathogensServiceInterface } from './pathogens-service-interface.js';
import { PATHOGENS_SERVICE } from './token.js';
import { CreatePathogenInDto } from './dtos/create-pathogen-in-dto.js';
import { UpdatePathogenInDto } from './dtos/update-pathogen-in-dto.js';
import { PathogenOutDto } from './dtos/pathogen-out-dto.js';
import { PathogenType } from './enums/pathogen-type.enum.js';
import { parseId } from '../../common/validators.js';
import { validateCreatePathogen, validatePathogenFilters, validateUpdatePathogen } from './pathogen-validator.js';

@ApiTags('pathogens')
@Controller('pathogens')
export class PathogensController {
  constructor(
    @Inject(PATHOGENS_SERVICE)
    private readonly pathogensService: PathogensServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar patógenos, con filtros opcionales' })
  @ApiQuery({ name: 'name', required: false, description: 'Busca en el nombre común o científico' })
  @ApiQuery({ name: 'pathogenType', required: false, enum: PathogenType })
  @ApiQuery({ name: 'transmissionMode', required: false })
  @ApiOkResponse({ type: PathogenOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('name') name?: string,
    @Query('pathogenType') pathogenType?: string,
    @Query('transmissionMode') transmissionMode?: string,
  ) {
    const filters = validatePathogenFilters(name, pathogenType, transmissionMode);
    return this.pathogensService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un patógeno por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PathogenOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe un patógeno con ese id' })
  findOne(@Param('id') id: string) {
    return this.pathogensService.findOne(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un patógeno' })
  @ApiBody({ type: CreatePathogenInDto })
  @ApiCreatedResponse({ type: PathogenOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo, está vacío o tiene un valor inválido' })
  @ApiConflictResponse({ description: 'Ya existe un patógeno con ese nombre científico' })
  create(@Body() body: CreatePathogenInDto) {
    const dto = validateCreatePathogen(body);
    return this.pathogensService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de un patógeno' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePathogenInDto })
  @ApiOkResponse({ type: PathogenOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe un patógeno con ese id' })
  @ApiConflictResponse({ description: 'Ya existe otro patógeno con ese nombre científico' })
  update(@Param('id') id: string, @Body() body: UpdatePathogenInDto) {
    const pathogenId = parseId(id);
    const dto = validateUpdatePathogen(body);
    return this.pathogensService.update(pathogenId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un patógeno' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Patógeno eliminado' })
  @ApiNotFoundResponse({ description: 'No existe un patógeno con ese id' })
  @ApiConflictResponse({ description: 'Tiene enfermedades asociadas' })
  remove(@Param('id') id: string) {
    return this.pathogensService.remove(parseId(id));
  }
}