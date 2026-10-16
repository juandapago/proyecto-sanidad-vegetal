import { RiskSeason } from '../enums/risk-season.enum.js';

export class DiseaseFilterInDto {
  name?: string;
  riskSeason?: RiskSeason;
  pathogenId?: number;
}