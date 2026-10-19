import { BadRequestException } from '@nestjs/common';
import { CreateTreatmentInDto } from './dtos/create-treatment-in-dto.js';
import { UpdateTreatmentInDto } from './dtos/update-treatment-in-dto.js';
import { TreatmentFilterInDto } from './dtos/treatment-filter-in-dto.js';
import { TreatmentType } from './enums/treatment-type.enum.js';
import { parseId, requireBody, requireEnum, requireId, requireString } from '../../common/validators.js';

const TREATMENT_TYPES: string[] = Object.values(TreatmentType);

export function validateCreateTreatment(body: any): CreateTreatmentInDto {
  requireBody(body);
  const dto = new CreateTreatmentInDto();
  dto.name = requireString(body.name, 'name', 100);
  dto.applicationDescription = requireString(body.applicationDescription, 'applicationDescription', 2000);
  dto.treatmentType = requireEnum(body.treatmentType, 'treatmentType', TREATMENT_TYPES) as TreatmentType;
  dto.diseaseId = requireId(body.diseaseId, 'diseaseId');
  return dto;
}

export function validateUpdateTreatment(body: any): UpdateTreatmentInDto {
  requireBody(body);
  const dto = new UpdateTreatmentInDto();
  if (body.name !== undefined) {
    dto.name = requireString(body.name, 'name', 100);
  }
  if (body.applicationDescription !== undefined) {
    dto.applicationDescription = requireString(body.applicationDescription, 'applicationDescription', 2000);
  }
  if (body.treatmentType !== undefined) {
    dto.treatmentType = requireEnum(body.treatmentType, 'treatmentType', TREATMENT_TYPES) as TreatmentType;
  }
  if (body.diseaseId !== undefined) {
    dto.diseaseId = requireId(body.diseaseId, 'diseaseId');
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validateTreatmentFilters(name?: string, treatmentType?: string, diseaseId?: string): TreatmentFilterInDto {
  const filters = new TreatmentFilterInDto();
  if (name !== undefined) {
    filters.name = requireString(name, 'name', 100);
  }
  if (treatmentType !== undefined) {
    filters.treatmentType = requireEnum(treatmentType, 'treatmentType', TREATMENT_TYPES) as TreatmentType;
  }
  if (diseaseId !== undefined) {
    filters.diseaseId = parseId(diseaseId, 'diseaseId');
  }
  return filters;
}