import { CreatePathogenInDto } from './dtos/create-pathogen-in-dto.js';
import { PathogenFilterInDto } from './dtos/pathogen-filter-in-dto.js';
import { PathogenOutDto } from './dtos/pathogen-out-dto.js';
import { UpdatePathogenInDto } from './dtos/update-pathogen-in-dto.js';

export interface PathogensServiceInterface {
  findAll(filters: PathogenFilterInDto): Promise<PathogenOutDto[]>;
  findOne(id: number): Promise<PathogenOutDto>;
  create(createPathogenInDto: CreatePathogenInDto): Promise<PathogenOutDto>;
  update(id: number, updatePathogenInDto: UpdatePathogenInDto): Promise<PathogenOutDto>;
  remove(id: number): Promise<void>;
}