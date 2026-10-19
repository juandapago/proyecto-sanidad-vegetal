import { StatisticsFilterInDto } from './dtos/statistics-filter-in-dto.js';
import { OutbreakGroupOutDto } from './dtos/outbreak-group-out-dto.js';

export interface StatisticsServiceInterface {
  byDisease(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]>;
  byPlant(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]>;
}