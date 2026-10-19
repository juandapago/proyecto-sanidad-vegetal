import { CreatePlantInDto } from './dtos/create-plant-in-dto.js';
import { UpdatePlantInDto } from './dtos/update-plant-in-dto.js';
import { PlantFilterInDto } from './dtos/plant-filter-in-dto.js';
import { PlantOutDto } from './dtos/plant-out-dto.js';
import { PlantDiseasesOutDto } from './dtos/plant-diseases-out-dto.js';
import { SusceptibilityLevel } from '../susceptibilities/enums/susceptibility-level.enum.js';

// Qué hace el servicio, sin decir cómo. El controlador depende de esto y no de la clase.
export interface PlantsServiceInterface {
  create(dto: CreatePlantInDto): Promise<PlantOutDto>;
  findAll(filter: PlantFilterInDto): Promise<PlantOutDto[]>;
  findOne(id: number): Promise<PlantOutDto>;
  update(id: number, dto: UpdatePlantInDto): Promise<PlantOutDto>;
  remove(id: number): Promise<void>;
  findDiseases(id: number, level?: SusceptibilityLevel): Promise<PlantDiseasesOutDto>;
}
