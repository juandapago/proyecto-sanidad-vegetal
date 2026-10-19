import { BadRequestException } from '@nestjs/common';
import { CreateCropInDto } from './dtos/create-crop-in-dto.js';
import { UpdateCropInDto } from './dtos/update-crop-in-dto.js';
import { CropFilterInDto } from './dtos/crop-filter-in-dto.js';
import {
  parseId,
  requireBody,
  requireId,
  requirePastDate,
  requireSequence,
  requireString,
} from '../../common/validators.js';

export function validateCreateCrop(body: any): CreateCropInDto {
  requireBody(body);
  const dto = new CreateCropInDto();
  dto.plantId = requireId(body.plantId, 'plantId');
  dto.lot = requireString(body.lot, 'lot', 100);
  dto.region = requireString(body.region, 'region', 100);
  dto.sowingDate = requirePastDate(body.sowingDate, 'sowingDate');
  dto.seedGeneticCode = requireSequence(body.seedGeneticCode, 'seedGeneticCode');
  return dto;
}

export function validateUpdateCrop(body: any): UpdateCropInDto {
  requireBody(body);
  const dto = new UpdateCropInDto();
  if (body.plantId !== undefined) {
    dto.plantId = requireId(body.plantId, 'plantId');
  }
  if (body.lot !== undefined) {
    dto.lot = requireString(body.lot, 'lot', 100);
  }
  if (body.region !== undefined) {
    dto.region = requireString(body.region, 'region', 100);
  }
  if (body.sowingDate !== undefined) {
    dto.sowingDate = requirePastDate(body.sowingDate, 'sowingDate');
  }
  if (body.seedGeneticCode !== undefined) {
    dto.seedGeneticCode = requireSequence(body.seedGeneticCode, 'seedGeneticCode');
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validateCropFilters(plantId?: string, region?: string, lot?: string): CropFilterInDto {
  const filters = new CropFilterInDto();
  if (plantId !== undefined) {
    filters.plantId = parseId(plantId, 'plantId');
  }
  if (region !== undefined) {
    filters.region = requireString(region, 'region', 100);
  }
  if (lot !== undefined) {
    filters.lot = requireString(lot, 'lot', 100);
  }
  return filters;
}