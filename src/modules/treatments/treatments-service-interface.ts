import { CreateTreatmentInDto } from './dtos/create-treatment-in-dto.js';
import { TreatmentFilterInDto } from './dtos/treatment-filter-in-dto.js';
import { TreatmentOutDto } from './dtos/treatment-out-dto.js';
import { UpdateTreatmentInDto } from './dtos/update-treatment-in-dto.js';

export interface TreatmentsServiceInterface {
  findAll(filters: TreatmentFilterInDto): Promise<TreatmentOutDto[]>;
  findOne(id: number): Promise<TreatmentOutDto>;
  create(createTreatmentInDto: CreateTreatmentInDto): Promise<TreatmentOutDto>;
  update(id: number, updateTreatmentInDto: UpdateTreatmentInDto): Promise<TreatmentOutDto>;
  remove(id: number): Promise<void>;
}