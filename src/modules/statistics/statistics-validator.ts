import { BadRequestException } from '@nestjs/common';
import { StatisticsFilterInDto } from './dtos/statistics-filter-in-dto.js';
import { parseId, requireDate } from '../../common/validators.js';

export function validateStatisticsFilters(from?: string, to?: string, limit?: string): StatisticsFilterInDto {
  const filters = new StatisticsFilterInDto();
  if (from !== undefined) {
    filters.from = requireDate(from, 'from');
  }
  if (to !== undefined) {
    filters.to = requireDate(to, 'to');
  }
  if (filters.from !== undefined && filters.to !== undefined && filters.from > filters.to) {
    throw new BadRequestException("El filtro 'from' no puede ser posterior a 'to'");
  }
  if (limit !== undefined) {
    filters.limit = parseId(limit, 'limit');
  }
  return filters;
}