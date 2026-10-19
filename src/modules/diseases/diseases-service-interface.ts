import { CreateDiseaseInDto } from './dtos/create-disease-in-dto.js';
import { DiseaseFilterInDto } from './dtos/disease-filter-in-dto.js';
import { DiseaseOutDto } from './dtos/disease-out-dto.js';
import { DiseaseDetailsOutDto } from './dtos/disease-details-out-dto.js';
import { UpdateDiseaseInDto } from './dtos/update-disease-in-dto.js';

export interface DiseasesServiceInterface {
  findAll(filters: DiseaseFilterInDto): Promise<DiseaseOutDto[]>;
  findOne(id: number): Promise<DiseaseOutDto>;
  create(createDiseaseInDto: CreateDiseaseInDto): Promise<DiseaseOutDto>;
  update(id: number, updateDiseaseInDto: UpdateDiseaseInDto): Promise<DiseaseOutDto>;
  remove(id: number): Promise<void>;
  findDetails(id: number): Promise<DiseaseDetailsOutDto>;
}