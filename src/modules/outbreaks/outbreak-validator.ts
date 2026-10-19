import { BadRequestException } from '@nestjs/common';
import { CreateOutbreakInDto } from './dtos/create-outbreak-in-dto.js';
import { UpdateOutbreakInDto } from './dtos/update-outbreak-in-dto.js';
import { OutbreakFilterInDto } from './dtos/outbreak-filter-in-dto.js';
import {
  parseId,
  requireBody,
  requireDate,
  requireId,
  requirePastDate,
  requirePositiveNumber,
  requireString,
} from '../../common/validators.js';

export function validateCreateOutbreak(body: any): CreateOutbreakInDto {
  requireBody(body);
  const dto = new CreateOutbreakInDto();
  dto.plantId = requireId(body.plantId, 'plantId');
  dto.diseaseId = requireId(body.diseaseId, 'diseaseId');
  dto.reportDate = requirePastDate(body.reportDate, 'reportDate');
  dto.region = requireString(body.region, 'region', 100);
  dto.affectedHectares = requirePositiveNumber(body.affectedHectares, 'affectedHectares');
  return dto;
}

export function validateUpdateOutbreak(body: any): UpdateOutbreakInDto {
  requireBody(body);
  const dto = new UpdateOutbreakInDto();
  if (body.plantId !== undefined) {
    dto.plantId = requireId(body.plantId, 'plantId');
  }
  if (body.diseaseId !== undefined) {
    dto.diseaseId = requireId(body.diseaseId, 'diseaseId');
  }
  if (body.reportDate !== undefined) {
    dto.reportDate = requirePastDate(body.reportDate, 'reportDate');
  }
  if (body.region !== undefined) {
    dto.region = requireString(body.region, 'region', 100);
  }
  if (body.affectedHectares !== undefined) {
    dto.affectedHectares = requirePositiveNumber(body.affectedHectares, 'affectedHectares');
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validateOutbreakFilters(
  plantId?: string,
  diseaseId?: string,
  region?: string,
  from?: string,
  to?: string,
  minHectares?: string,
): OutbreakFilterInDto {
  const filters = new OutbreakFilterInDto();
  if (plantId !== undefined) {
    filters.plantId = parseId(plantId, 'plantId');
  }
  if (diseaseId !== undefined) {
    filters.diseaseId = parseId(diseaseId, 'diseaseId');
  }
  if (region !== undefined) {
    filters.region = requireString(region, 'region', 100);
  }
  if (from !== undefined) {
    filters.from = requireDate(from, 'from');
  }
  if (to !== undefined) {
    filters.to = requireDate(to, 'to');
  }
  if (filters.from !== undefined && filters.to !== undefined && filters.from > filters.to) {
    throw new BadRequestException("El filtro 'from' no puede ser posterior a 'to'");
  }
  if (minHectares !== undefined) {
    const min = Number(minHectares);
    if (minHectares.trim() === '' || !Number.isFinite(min) || min < 0) {
      throw new BadRequestException("El filtro 'minHectares' debe ser un número mayor o igual a 0");
    }
    filters.minHectares = min;
  }
  return filters;
}