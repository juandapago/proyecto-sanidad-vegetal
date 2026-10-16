import { CreateSusceptibilityInDto } from './dtos/create-susceptibility-in-dto.js';
import { UpdateSusceptibilityInDto } from './dtos/update-susceptibility-in-dto.js';
import { SusceptibilityFilterInDto } from './dtos/susceptibility-filter-in-dto.js';
import { SusceptibilityOutDto } from './dtos/susceptibility-out-dto.js';

export interface SusceptibilitiesServiceInterface {
  findAll(filters: SusceptibilityFilterInDto): Promise<SusceptibilityOutDto[]>;
  findOne(id: number): Promise<SusceptibilityOutDto>;
  create(dto: CreateSusceptibilityInDto): Promise<SusceptibilityOutDto>;
  update(id: number, dto: UpdateSusceptibilityInDto): Promise<SusceptibilityOutDto>;
  remove(id: number): Promise<void>;
}