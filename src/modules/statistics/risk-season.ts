import { RiskSeason } from '../diseases/enums/risk-season.enum.js';

function monthToSeason(month: number): RiskSeason {
  if (month >= 3 && month <= 5) return RiskSeason.PRIMAVERA;
  if (month >= 6 && month <= 8) return RiskSeason.VERANO;
  if (month >= 9 && month <= 11) return RiskSeason.OTONO;
  return RiskSeason.INVIERNO;
}

export function isInRiskSeason(month: number, riskSeason: RiskSeason): boolean {
  if (riskSeason === RiskSeason.TODO_EL_ANO) return true;
  return monthToSeason(month) === riskSeason;
}
