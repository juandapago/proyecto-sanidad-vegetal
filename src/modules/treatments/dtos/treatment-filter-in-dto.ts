import { TreatmentType } from '../enums/treatment-type.enum.js';

export class TreatmentFilterInDto {
  name?: string;
  treatmentType?: TreatmentType;
  diseaseId?: number;
}