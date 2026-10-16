import { BadRequestException } from '@nestjs/common';
import { CreatePathogenInDto } from './dtos/create-pathogen-in-dto.js';
import { UpdatePathogenInDto } from './dtos/update-pathogen-in-dto.js';
import { PathogenFilterInDto } from './dtos/pathogen-filter-in-dto.js';
import { PathogenType } from './enums/pathogen-type.enum.js';
import { requireBody, requireEnum, requireSequence, requireString } from '../../common/validators.js';

const PATHOGEN_TYPES: string[] = Object.values(PathogenType);

export function validateCreatePathogen(body: any): CreatePathogenInDto {
  requireBody(body);
  const dto = new CreatePathogenInDto();
  dto.name = requireString(body.name, 'name', 100);
  dto.scientificName = requireString(body.scientificName, 'scientificName', 150);
  dto.pathogenType = requireEnum(body.pathogenType, 'pathogenType', PATHOGEN_TYPES) as PathogenType;
  dto.transmissionMode = requireString(body.transmissionMode, 'transmissionMode', 100);
  dto.geneticSequence = requireSequence(body.geneticSequence, 'geneticSequence');
  return dto;
}

export function validateUpdatePathogen(body: any): UpdatePathogenInDto {
  requireBody(body);
  const dto = new UpdatePathogenInDto();
  if (body.name !== undefined) {
    dto.name = requireString(body.name, 'name', 100);
  }
  if (body.scientificName !== undefined) {
    dto.scientificName = requireString(body.scientificName, 'scientificName', 150);
  }
  if (body.pathogenType !== undefined) {
    dto.pathogenType = requireEnum(body.pathogenType, 'pathogenType', PATHOGEN_TYPES) as PathogenType;
  }
  if (body.transmissionMode !== undefined) {
    dto.transmissionMode = requireString(body.transmissionMode, 'transmissionMode', 100);
  }
  if (body.geneticSequence !== undefined) {
    dto.geneticSequence = requireSequence(body.geneticSequence, 'geneticSequence');
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validatePathogenFilters(name?: string, pathogenType?: string, transmissionMode?: string): PathogenFilterInDto {
  const filters = new PathogenFilterInDto();
  if (name !== undefined) {
    filters.name = requireString(name, 'name', 150);
  }
  if (pathogenType !== undefined) {
    filters.pathogenType = requireEnum(pathogenType, 'pathogenType', PATHOGEN_TYPES) as PathogenType;
  }
  if (transmissionMode !== undefined) {
    filters.transmissionMode = requireString(transmissionMode, 'transmissionMode', 100);
  }
  return filters;
}