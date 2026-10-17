import { CreateOutbreakInDto } from './dtos/create-outbreak-in-dto.js';
import { UpdateOutbreakInDto } from './dtos/update-outbreak-in-dto.js';
import { OutbreakFilterInDto } from './dtos/outbreak-filter-in-dto.js';
import { OutbreakOutDto } from './dtos/outbreak-out-dto.js';
import { OutbreakDetailsOutDto } from './dtos/outbreak-details-out-dto.js';

export interface OutbreaksServiceInterface {
  findAll(filters: OutbreakFilterInDto): Promise<OutbreakOutDto[]>;
  findOne(id: number): Promise<OutbreakOutDto>;
  create(dto: CreateOutbreakInDto): Promise<OutbreakOutDto>;
  update(id: number, dto: UpdateOutbreakInDto): Promise<OutbreakOutDto>;
  remove(id: number): Promise<void>;
  findDetails(id: number): Promise<OutbreakDetailsOutDto>;
}