import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { TreatmentsServiceInterface } from './treatments-service-interface.js';
import { Treatment } from './entities/treatment.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { CreateTreatmentInDto } from './dtos/create-treatment-in-dto.js';
import { UpdateTreatmentInDto } from './dtos/update-treatment-in-dto.js';
import { TreatmentFilterInDto } from './dtos/treatment-filter-in-dto.js';
import { TreatmentOutDto } from './dtos/treatment-out-dto.js';

@Injectable()
export class TreatmentsService implements TreatmentsServiceInterface {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}

  async findAll(filters: TreatmentFilterInDto): Promise<TreatmentOutDto[]> {
    const where: FindOptionsWhere<Treatment> = {};
    if (filters.name !== undefined) {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters.treatmentType !== undefined) {
      where.treatmentType = filters.treatmentType;
    }
    if (filters.diseaseId !== undefined) {
      where.diseaseId = filters.diseaseId;
    }
    const treatments = await this.treatmentRepository.find({ where });
    return treatments.map((treatment) => this.toOutDto(treatment));
  }

  async findOne(id: number): Promise<TreatmentOutDto> {
    const treatment = await this.findTreatmentOrFail(id);
    return this.toOutDto(treatment);
  }

  async create(createTreatmentInDto: CreateTreatmentInDto): Promise<TreatmentOutDto> {
    await this.checkDiseaseExists(createTreatmentInDto.diseaseId);

    const treatment = new Treatment();
    treatment.name = createTreatmentInDto.name;
    treatment.applicationDescription = createTreatmentInDto.applicationDescription;
    treatment.treatmentType = createTreatmentInDto.treatmentType;
    treatment.diseaseId = createTreatmentInDto.diseaseId;

    const saved = await this.treatmentRepository.save(treatment);
    return this.toOutDto(saved);
  }

  async update(id: number, updateTreatmentInDto: UpdateTreatmentInDto): Promise<TreatmentOutDto> {
    const treatment = await this.findTreatmentOrFail(id);

    if (updateTreatmentInDto.diseaseId !== undefined) {
      await this.checkDiseaseExists(updateTreatmentInDto.diseaseId);
      treatment.diseaseId = updateTreatmentInDto.diseaseId;
    }
    if (updateTreatmentInDto.name !== undefined) {
      treatment.name = updateTreatmentInDto.name;
    }
    if (updateTreatmentInDto.applicationDescription !== undefined) {
      treatment.applicationDescription = updateTreatmentInDto.applicationDescription;
    }
    if (updateTreatmentInDto.treatmentType !== undefined) {
      treatment.treatmentType = updateTreatmentInDto.treatmentType;
    }

    const saved = await this.treatmentRepository.save(treatment);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const treatment = await this.findTreatmentOrFail(id);
    await this.treatmentRepository.remove(treatment);
  }

  private async findTreatmentOrFail(id: number): Promise<Treatment> {
    const treatment = await this.treatmentRepository.findOneBy({ id });
    if (treatment == null) {
      throw new NotFoundException(`No se encontró el tratamiento con id ${id}`);
    }
    return treatment;
  }

  private async checkDiseaseExists(diseaseId: number): Promise<void> {
    const exists = await this.diseaseRepository.existsBy({ id: diseaseId });
    if (!exists) {
      throw new NotFoundException(`No se encontró la enfermedad con id ${diseaseId}`);
    }
  }

  private toOutDto(treatment: Treatment): TreatmentOutDto {
    return {
      id: treatment.id,
      name: treatment.name,
      applicationDescription: treatment.applicationDescription,
      treatmentType: treatment.treatmentType,
      diseaseId: treatment.diseaseId,
    };
  }
}