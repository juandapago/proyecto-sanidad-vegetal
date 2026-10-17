import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { CropsServiceInterface } from './crops-service-interface.js';
import { Crop } from './entities/crop.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Susceptibility } from '../susceptibilities/entities/susceptibility.entity.js';
import { SusceptibilityLevel } from '../susceptibilities/enums/susceptibility-level.enum.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';
import { todayInColombia } from '../../common/validators.js';
import { CreateCropInDto } from './dtos/create-crop-in-dto.js';
import { UpdateCropInDto } from './dtos/update-crop-in-dto.js';
import { CropFilterInDto } from './dtos/crop-filter-in-dto.js';
import { CropOutDto } from './dtos/crop-out-dto.js';
import { MutationCheckOutDto } from './dtos/mutation-check-out-dto.js';
import { CropRiskOutDto } from './dtos/crop-risk-out-dto.js';
import { CropRiskDiseaseOutDto } from './dtos/crop-risk-disease-out-dto.js';

// Un brote se considera "reciente" si se reportó en los últimos 12 meses
const RECENT_MONTHS = 12;

@Injectable()
export class CropsService implements CropsServiceInterface {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(Susceptibility)
    private readonly susceptibilityRepository: Repository<Susceptibility>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Outbreak)
    private readonly outbreakRepository: Repository<Outbreak>,
  ) {}

  async findAll(filters: CropFilterInDto): Promise<CropOutDto[]> {
    const where: FindOptionsWhere<Crop> = {};
    if (filters.plantId !== undefined) {
      where.plantId = filters.plantId;
    }
    if (filters.region !== undefined) {
      where.region = Like(`%${filters.region}%`);
    }
    if (filters.lot !== undefined) {
      where.lot = Like(`%${filters.lot}%`);
    }
    const crops = await this.cropRepository.find({ where });
    return crops.map((crop) => this.toOutDto(crop));
  }

  async findOne(id: number): Promise<CropOutDto> {
    const crop = await this.findCropOrFail(id);
    return this.toOutDto(crop);
  }

  async create(createCropInDto: CreateCropInDto): Promise<CropOutDto> {
    await this.checkPlantExists(createCropInDto.plantId);

    const crop = new Crop();
    crop.plantId = createCropInDto.plantId;
    crop.lot = createCropInDto.lot;
    crop.region = createCropInDto.region;
    crop.sowingDate = createCropInDto.sowingDate;
    crop.seedGeneticCode = createCropInDto.seedGeneticCode;

    const saved = await this.cropRepository.save(crop);
    return this.toOutDto(saved);
  }

  async update(id: number, updateCropInDto: UpdateCropInDto): Promise<CropOutDto> {
    const crop = await this.findCropOrFail(id);

    if (updateCropInDto.plantId !== undefined) {
      await this.checkPlantExists(updateCropInDto.plantId);
      crop.plantId = updateCropInDto.plantId;
    }
    if (updateCropInDto.lot !== undefined) {
      crop.lot = updateCropInDto.lot;
    }
    if (updateCropInDto.region !== undefined) {
      crop.region = updateCropInDto.region;
    }
    if (updateCropInDto.sowingDate !== undefined) {
      crop.sowingDate = updateCropInDto.sowingDate;
    }
    if (updateCropInDto.seedGeneticCode !== undefined) {
      crop.seedGeneticCode = updateCropInDto.seedGeneticCode;
    }

    const saved = await this.cropRepository.save(crop);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const crop = await this.findCropOrFail(id);
    await this.cropRepository.remove(crop);
  }

  async checkMutations(id: number): Promise<MutationCheckOutDto> {
    const crop = await this.findCropOrFail(id);

    const plant = await this.plantRepository.findOneBy({ id: crop.plantId });
    if (plant == null) {
      throw new NotFoundException(`No se encontró la planta con id ${crop.plantId}`);
    }

    const seed = crop.seedGeneticCode;
    const reference = plant.geneticSequence;

    if (seed.length !== reference.length) {
      throw new UnprocessableEntityException(
        `La semilla tiene ${seed.length} bases y la referencia de la planta tiene ${reference.length}; deben tener la misma longitud para comparar`,
      );
    }

    let mutations: number = 0;
    const mutatedPositions: number[] = [];
    for (let i = 0; i < seed.length; i++) {
      if (seed[i] !== reference[i]) {
        mutations++;
        mutatedPositions.push(i + 1);
      }
    }

    const similarityPercentage = Math.round(((seed.length - mutations) / seed.length) * 10000) / 100;

    return {
      cropId: crop.id,
      plantId: plant.id,
      plantScientificName: plant.scientificName,
      sequenceLength: seed.length,
      mutations,
      mutatedPositions,
      similarityPercentage,
    };
  }

  async findRisk(id: number): Promise<CropRiskOutDto> {
    const crop = await this.findCropOrFail(id);

    const plant = await this.plantRepository.findOneBy({ id: crop.plantId });
    if (plant == null) {
      throw new NotFoundException(`No se encontró la planta con id ${crop.plantId}`);
    }

    const recentSince = this.recentSinceDate();
    const cropOutDto = this.toOutDto(crop);
    const plantOutDto = {
      id: plant.id,
      commonName: plant.commonName,
      scientificName: plant.scientificName,
      botanicalFamily: plant.botanicalFamily,
      cropType: plant.cropType,
      geneticSequence: plant.geneticSequence,
    };

    const susceptibilities = await this.susceptibilityRepository.findBy({
      plantId: plant.id,
      level: SusceptibilityLevel.ALTA,
    });
    if (susceptibilities.length === 0) {
      return { crop: cropOutDto, plant: plantOutDto, recentSince, riskDiseases: [], totalRecentOutbreaks: 0 };
    }

    const diseaseIds = susceptibilities.map((susceptibility) => susceptibility.diseaseId);
    const diseases = await this.diseaseRepository.findBy({ id: In(diseaseIds) });
    const outbreaks = await this.outbreakRepository.findBy({
      diseaseId: In(diseaseIds),
      region: crop.region,
      reportDate: MoreThanOrEqual(recentSince),
    });

    const riskDiseases: CropRiskDiseaseOutDto[] = diseases.map((disease) => ({
      disease: {
        id: disease.id,
        name: disease.name,
        symptoms: disease.symptoms,
        riskSeason: disease.riskSeason,
        pathogenId: disease.pathogenId,
      },
      recentOutbreaks: outbreaks
        .filter((outbreak) => outbreak.diseaseId === disease.id)
        .map((outbreak) => ({
          id: outbreak.id,
          plantId: outbreak.plantId,
          diseaseId: outbreak.diseaseId,
          reportDate: outbreak.reportDate,
          region: outbreak.region,
          affectedHectares: Number(outbreak.affectedHectares),
        })),
    }));

    return {
      crop: cropOutDto,
      plant: plantOutDto,
      recentSince,
      riskDiseases,
      totalRecentOutbreaks: outbreaks.length,
    };
  }

  private recentSinceDate(): string {
    const [year, month, day] = todayInColombia().split('-').map(Number);
    const since = new Date(Date.UTC(year, month - 1 - RECENT_MONTHS, day));
    return since.toISOString().slice(0, 10);
  }

  private async findCropOrFail(id: number): Promise<Crop> {
    const crop = await this.cropRepository.findOneBy({ id });
    if (crop == null) {
      throw new NotFoundException(`No se encontró el cultivo con id ${id}`);
    }
    return crop;
  }

  private async checkPlantExists(plantId: number): Promise<void> {
    const exists = await this.plantRepository.existsBy({ id: plantId });
    if (!exists) {
      throw new NotFoundException(`No se encontró la planta con id ${plantId}`);
    }
  }

  private toOutDto(crop: Crop): CropOutDto {
    return {
      id: crop.id,
      plantId: crop.plantId,
      lot: crop.lot,
      region: crop.region,
      sowingDate: crop.sowingDate,
      seedGeneticCode: crop.seedGeneticCode,
    };
  }
}