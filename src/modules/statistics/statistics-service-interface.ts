import { StatisticsFilterInDto } from './dtos/statistics-filter-in-dto.js';
import { OutbreakGroupOutDto } from './dtos/outbreak-group-out-dto.js';
import { RegionOutbreakOutDto } from './dtos/region-outbreak-out-dto.js';
import { MonthOutbreakOutDto } from './dtos/month-outbreak-out-dto.js';
import { OutbreakSummaryOutDto } from './dtos/outbreak-summary-out-dto.js';

export interface StatisticsServiceInterface {
  byDisease(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]>;
  byPlant(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]>;
  byPathogen(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]>;
  byRegion(filters: StatisticsFilterInDto): Promise<RegionOutbreakOutDto[]>;
  byMonth(filters: StatisticsFilterInDto): Promise<MonthOutbreakOutDto[]>;
  summary(filters: StatisticsFilterInDto): Promise<OutbreakSummaryOutDto>;
}