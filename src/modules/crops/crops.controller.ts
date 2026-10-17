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
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { CropsServiceInterface } from './crops-service-interface.js';
import { CROPS_SERVICE } from './token.js';
import { CreateCropInDto } from './dtos/create-crop-in-dto.js';
import { UpdateCropInDto } from './dtos/update-crop-in-dto.js';
import { CropOutDto } from './dtos/crop-out-dto.js';
import { MutationCheckOutDto } from './dtos/mutation-check-out-dto.js';
import { parseId } from '../../common/validators.js';
import { validateCreateCrop, validateCropFilters, validateUpdateCrop } from './crop-validator.js';

@ApiTags('crops')
@Controller('crops')
export class CropsController {
  constructor(
    @Inject(CROPS_SERVICE)
    private readonly cropsService: CropsServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar cultivos, con filtros opcionales' })
  @ApiQuery({ name: 'plantId', required: false, type: Number })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'lot', required: false })
  @ApiOkResponse({ type: CropOutDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Algún filtro tiene un valor inválido' })
  findAll(
    @Query('plantId') plantId?: string,
    @Query('region') region?: string,
    @Query('lot') lot?: string,
  ) {
    const filters = validateCropFilters(plantId, region, lot);
    return this.cropsService.findAll(filters);
  }

  @Get(':id/mutations')
  @ApiOperation({ summary: 'Verificar cuántas mutaciones tiene la semilla del cultivo frente a la secuencia de su planta' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: MutationCheckOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe el cultivo o su planta' })
  @ApiUnprocessableEntityResponse({ description: 'La semilla y la secuencia de referencia tienen distinta longitud' })
  checkMutations(@Param('id') id: string) {
    return this.cropsService.checkMutations(parseId(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cultivo por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: CropOutDto })
  @ApiBadRequestResponse({ description: 'El id no es un entero positivo' })
  @ApiNotFoundResponse({ description: 'No existe un cultivo con ese id' })
  findOne(@Param('id') id: string) {
    return this.cropsService.findOne(parseId(id));
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un cultivo' })
  @ApiBody({ type: CreateCropInDto })
  @ApiCreatedResponse({ type: CropOutDto })
  @ApiBadRequestResponse({ description: 'Falta un campo, la fecha es inválida o futura, o el código genético es inválido' })
  @ApiNotFoundResponse({ description: 'La planta no existe' })
  create(@Body() body: CreateCropInDto) {
    const dto = validateCreateCrop(body);
    return this.cropsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar uno o varios campos de un cultivo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCropInDto })
  @ApiOkResponse({ type: CropOutDto })
  @ApiBadRequestResponse({ description: 'El id o algún campo es inválido, o no se envió ningún campo' })
  @ApiNotFoundResponse({ description: 'No existe el cultivo o la planta' })
  update(@Param('id') id: string, @Body() body: UpdateCropInDto) {
    const cropId = parseId(id);
    const dto = validateUpdateCrop(body);
    return this.cropsService.update(cropId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un cultivo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Cultivo eliminado' })
  @ApiNotFoundResponse({ description: 'No existe un cultivo con ese id' })
  remove(@Param('id') id: string) {
    return this.cropsService.remove(parseId(id));
  }
}