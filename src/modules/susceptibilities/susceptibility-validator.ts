import { BadRequestException } from '@nestjs/common';
import { CreateSusceptibilityInDto } from './dtos/create-susceptibility-in-dto.js';
import { UpdateSusceptibilityInDto } from './dtos/update-susceptibility-in-dto.js';
import { SusceptibilityFilterInDto } from './dtos/susceptibility-filter-in-dto.js';
import { SusceptibilityLevel } from './enums/susceptibility-level.enum.js';
import { parseId, requireBody, requireEnum, requireId } from '../../common/validators.js';

const LEVELS: string[] = Object.values(SusceptibilityLevel);

export function validateCreateSusceptibility(body: any): CreateSusceptibilityInDto {
  requireBody(body);
  const dto = new CreateSusceptibilityInDto();
  dto.plantId = requireId(body.plantId, 'plantId');
  dto.diseaseId = requireId(body.diseaseId, 'diseaseId');
  dto.level = requireEnum(body.level, 'level', LEVELS) as SusceptibilityLevel;
  return dto;
}

export function validateUpdateSusceptibility(body: any): UpdateSusceptibilityInDto {
  requireBody(body);
  const dto = new UpdateSusceptibilityInDto();
  if (body.plantId !== undefined) {
    dto.plantId = requireId(body.plantId, 'plantId');
  }
  if (body.diseaseId !== undefined) {
    dto.diseaseId = requireId(body.diseaseId, 'diseaseId');
  }
  if (body.level !== undefined) {
    dto.level = requireEnum(body.level, 'level', LEVELS) as SusceptibilityLevel;
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validateSusceptibilityFilters(plantId?: string, diseaseId?: string, level?: string): SusceptibilityFilterInDto {
  const filters = new SusceptibilityFilterInDto();
  if (plantId !== undefined) {
    filters.plantId = parseId(plantId, 'plantId');
  }
  if (diseaseId !== undefined) {
    filters.diseaseId = parseId(diseaseId, 'diseaseId');
  }
  if (level !== undefined) {
    filters.level = requireEnum(level, 'level', LEVELS) as SusceptibilityLevel;
  }
  return filters;
}