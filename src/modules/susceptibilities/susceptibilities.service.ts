import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { SusceptibilitiesServiceInterface } from './susceptibilities-service-interface.js';
import { Susceptibility } from './entities/susceptibility.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { CreateSusceptibilityInDto } from './dtos/create-susceptibility-in-dto.js';
import { UpdateSusceptibilityInDto } from './dtos/update-susceptibility-in-dto.js';
import { SusceptibilityFilterInDto } from './dtos/susceptibility-filter-in-dto.js';
import { SusceptibilityOutDto } from './dtos/susceptibility-out-dto.js';

@Injectable()
export class SusceptibilitiesService implements SusceptibilitiesServiceInterface {
  constructor(
    @InjectRepository(Susceptibility)
    private readonly susceptibilityRepository: Repository<Susceptibility>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}

  async findAll(filters: SusceptibilityFilterInDto): Promise<SusceptibilityOutDto[]> {
    const where: FindOptionsWhere<Susceptibility> = {};
    if (filters.plantId !== undefined) {
      where.plantId = filters.plantId;
    }
    if (filters.diseaseId !== undefined) {
      where.diseaseId = filters.diseaseId;
    }
    if (filters.level !== undefined) {
      where.level = filters.level;
    }
    const susceptibilities = await this.susceptibilityRepository.find({ where });
    return susceptibilities.map((susceptibility) => this.toOutDto(susceptibility));
  }

  async findOne(id: number): Promise<SusceptibilityOutDto> {
    const susceptibility = await this.findSusceptibilityOrFail(id);
    return this.toOutDto(susceptibility);
  }

  async create(createSusceptibilityInDto: CreateSusceptibilityInDto): Promise<SusceptibilityOutDto> {
    await this.checkPlantExists(createSusceptibilityInDto.plantId);
    await this.checkDiseaseExists(createSusceptibilityInDto.diseaseId);
    await this.checkPairIsFree(createSusceptibilityInDto.plantId, createSusceptibilityInDto.diseaseId);

    const susceptibility = new Susceptibility();
    susceptibility.plantId = createSusceptibilityInDto.plantId;
    susceptibility.diseaseId = createSusceptibilityInDto.diseaseId;
    susceptibility.level = createSusceptibilityInDto.level;

    const saved = await this.saveOrConflict(susceptibility);
    return this.toOutDto(saved);
  }

  async update(id: number, updateSusceptibilityInDto: UpdateSusceptibilityInDto): Promise<SusceptibilityOutDto> {
    const susceptibility = await this.findSusceptibilityOrFail(id);

    if (updateSusceptibilityInDto.plantId !== undefined) {
      await this.checkPlantExists(updateSusceptibilityInDto.plantId);
      susceptibility.plantId = updateSusceptibilityInDto.plantId;
    }
    if (updateSusceptibilityInDto.diseaseId !== undefined) {
      await this.checkDiseaseExists(updateSusceptibilityInDto.diseaseId);
      susceptibility.diseaseId = updateSusceptibilityInDto.diseaseId;
    }
    if (updateSusceptibilityInDto.plantId !== undefined || updateSusceptibilityInDto.diseaseId !== undefined) {
      await this.checkPairIsFree(susceptibility.plantId, susceptibility.diseaseId, id);
    }
    if (updateSusceptibilityInDto.level !== undefined) {
      susceptibility.level = updateSusceptibilityInDto.level;
    }

    const saved = await this.saveOrConflict(susceptibility);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const susceptibility = await this.findSusceptibilityOrFail(id);
    await this.susceptibilityRepository.remove(susceptibility);
  }

  private async findSusceptibilityOrFail(id: number): Promise<Susceptibility> {
    const susceptibility = await this.susceptibilityRepository.findOneBy({ id });
    if (susceptibility == null) {
      throw new NotFoundException(`No se encontró la susceptibilidad con id ${id}`);
    }
    return susceptibility;
  }

  private async checkPlantExists(plantId: number): Promise<void> {
    const exists = await this.plantRepository.existsBy({ id: plantId });
    if (!exists) {
      throw new NotFoundException(`No se encontró la planta con id ${plantId}`);
    }
  }

  private async checkDiseaseExists(diseaseId: number): Promise<void> {
    const exists = await this.diseaseRepository.existsBy({ id: diseaseId });
    if (!exists) {
      throw new NotFoundException(`No se encontró la enfermedad con id ${diseaseId}`);
    }
  }

  private async checkPairIsFree(plantId: number, diseaseId: number, excludeId?: number): Promise<void> {
    const where: FindOptionsWhere<Susceptibility> = { plantId, diseaseId };
    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }
    const existing = await this.susceptibilityRepository.findOneBy(where);
    if (existing != null) {
      throw new ConflictException(
        `Ya existe una susceptibilidad registrada para la planta ${plantId} y la enfermedad ${diseaseId}`,
      );
    }
  }

  private async saveOrConflict(susceptibility: Susceptibility): Promise<Susceptibility> {
    try {
      return await this.susceptibilityRepository.save(susceptibility);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `Ya existe una susceptibilidad registrada para la planta ${susceptibility.plantId} y la enfermedad ${susceptibility.diseaseId}`,
        );
      }
      throw error;
    }
  }

  private toOutDto(susceptibility: Susceptibility): SusceptibilityOutDto {
    return {
      id: susceptibility.id,
      plantId: susceptibility.plantId,
      diseaseId: susceptibility.diseaseId,
      level: susceptibility.level,
    };
  }
}