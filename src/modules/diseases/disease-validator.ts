import { BadRequestException } from '@nestjs/common';
import { CreateDiseaseInDto } from './dtos/create-disease-in-dto.js';
import { UpdateDiseaseInDto } from './dtos/update-disease-in-dto.js';
import { DiseaseFilterInDto } from './dtos/disease-filter-in-dto.js';
import { RiskSeason } from './enums/risk-season.enum.js';
import { parseId, requireBody, requireEnum, requireId, requireString } from '../../common/validators.js';

const RISK_SEASONS: string[] = Object.values(RiskSeason);

export function validateCreateDisease(body: any): CreateDiseaseInDto {
  requireBody(body);
  const dto = new CreateDiseaseInDto();
  dto.name = requireString(body.name, 'name', 100);
  dto.symptoms = requireString(body.symptoms, 'symptoms', 2000);
  dto.riskSeason = requireEnum(body.riskSeason, 'riskSeason', RISK_SEASONS) as RiskSeason;
  dto.pathogenId = requireId(body.pathogenId, 'pathogenId');
  return dto;
}

export function validateUpdateDisease(body: any): UpdateDiseaseInDto {
  requireBody(body);
  const dto = new UpdateDiseaseInDto();
  if (body.name !== undefined) {
    dto.name = requireString(body.name, 'name', 100);
  }
  if (body.symptoms !== undefined) {
    dto.symptoms = requireString(body.symptoms, 'symptoms', 2000);
  }
  if (body.riskSeason !== undefined) {
    dto.riskSeason = requireEnum(body.riskSeason, 'riskSeason', RISK_SEASONS) as RiskSeason;
  }
  if (body.pathogenId !== undefined) {
    dto.pathogenId = requireId(body.pathogenId, 'pathogenId');
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validateDiseaseFilters(name?: string, riskSeason?: string, pathogenId?: string): DiseaseFilterInDto {
  const filters = new DiseaseFilterInDto();
  if (name !== undefined) {
    filters.name = requireString(name, 'name', 100);
  }
  if (riskSeason !== undefined) {
    filters.riskSeason = requireEnum(riskSeason, 'riskSeason', RISK_SEASONS) as RiskSeason;
  }
  if (pathogenId !== undefined) {
    filters.pathogenId = parseId(pathogenId, 'pathogenId');
  }
  return filters;
}