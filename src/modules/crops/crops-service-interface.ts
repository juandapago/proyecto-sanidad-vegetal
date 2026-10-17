import { CreateCropInDto } from './dtos/create-crop-in-dto.js';
import { UpdateCropInDto } from './dtos/update-crop-in-dto.js';
import { CropFilterInDto } from './dtos/crop-filter-in-dto.js';
import { CropOutDto } from './dtos/crop-out-dto.js';
import { MutationCheckOutDto } from './dtos/mutation-check-out-dto.js';
import { CropRiskOutDto } from './dtos/crop-risk-out-dto.js';

export interface CropsServiceInterface {
  findAll(filters: CropFilterInDto): Promise<CropOutDto[]>;
  findOne(id: number): Promise<CropOutDto>;
  create(dto: CreateCropInDto): Promise<CropOutDto>;
  update(id: number, dto: UpdateCropInDto): Promise<CropOutDto>;
  remove(id: number): Promise<void>;
  checkMutations(id: number): Promise<MutationCheckOutDto>;
  findRisk(id: number): Promise<CropRiskOutDto>;
}