import { SusceptibilityLevel } from '../enums/susceptibility-level.enum.js';

export class SusceptibilityFilterInDto {
  plantId?: number;
  diseaseId?: number;
  level?: SusceptibilityLevel;
}