import { CropType } from '../enums/crop-type.enum.js';

// Filtros de GET /plants (query params). Todos opcionales y combinables.
export class PlantFilterInDto {
  cropType?: CropType;
  botanicalFamily?: string;
  name?: string; // busca dentro del nombre común o del nombre científico
}