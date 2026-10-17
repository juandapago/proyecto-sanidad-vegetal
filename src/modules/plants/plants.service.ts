import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { PlantsServiceInterface } from './plants-service-interface.js';
import { Plant } from './entities/plant.entity.js';
import { Susceptibility } from '../susceptibilities/entities/susceptibility.entity.js';
import { SusceptibilityLevel } from '../susceptibilities/enums/susceptibility-level.enum.js';
import { Crop } from '../crops/entities/crop.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { Treatment } from '../treatments/entities/treatment.entity.js';
import { CreatePlantInDto } from './dtos/create-plant-in-dto.js';
import { UpdatePlantInDto } from './dtos/update-plant-in-dto.js';
import { PlantFilterInDto } from './dtos/plant-filter-in-dto.js';
import { PlantOutDto } from './dtos/plant-out-dto.js';
import { PlantDiseaseOutDto } from './dtos/plant-disease-out-dto.js';
import { PlantDiseasesOutDto } from './dtos/plant-diseases-out-dto.js';

@Injectable()
export class PlantsService implements PlantsServiceInterface {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(Susceptibility)
    private readonly susceptibilityRepository: Repository<Susceptibility>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
  ) {}

  async findAll(filters: PlantFilterInDto): Promise<PlantOutDto[]> {
    const where: FindOptionsWhere<Plant> = {};
    if (filters.cropType !== undefined) {
      where.cropType = filters.cropType;
    }
    if (filters.botanicalFamily !== undefined) {
      where.botanicalFamily = Like(`%${filters.botanicalFamily}%`);
    }

    let plants: Plant[];
    if (filters.name !== undefined) {
      plants = await this.plantRepository.find({
        where: [
          { ...where, commonName: Like(`%${filters.name}%`) },
          { ...where, scientificName: Like(`%${filters.name}%`) },
        ],
      });
    } else {
      plants = await this.plantRepository.find({ where });
    }
    return plants.map((plant) => this.toOutDto(plant));
  }

  async findOne(id: number): Promise<PlantOutDto> {
    const plant = await this.findPlantOrFail(id);
    return this.toOutDto(plant);
  }

  async create(createPlantInDto: CreatePlantInDto): Promise<PlantOutDto> {
    await this.checkScientificNameIsFree(createPlantInDto.scientificName);

    const plant = new Plant();
    plant.commonName = createPlantInDto.commonName;
    plant.scientificName = createPlantInDto.scientificName;
    plant.botanicalFamily = createPlantInDto.botanicalFamily;
    plant.cropType = createPlantInDto.cropType;
    plant.geneticSequence = createPlantInDto.geneticSequence;

    const saved = await this.saveOrConflict(plant);
    return this.toOutDto(saved);
  }

  async update(id: number, updatePlantInDto: UpdatePlantInDto): Promise<PlantOutDto> {
    const plant = await this.findPlantOrFail(id);

    if (updatePlantInDto.scientificName !== undefined) {
      await this.checkScientificNameIsFree(updatePlantInDto.scientificName, id);
      plant.scientificName = updatePlantInDto.scientificName;
    }
    if (updatePlantInDto.commonName !== undefined) {
      plant.commonName = updatePlantInDto.commonName;
    }
    if (updatePlantInDto.botanicalFamily !== undefined) {
      plant.botanicalFamily = updatePlantInDto.botanicalFamily;
    }
    if (updatePlantInDto.cropType !== undefined) {
      plant.cropType = updatePlantInDto.cropType;
    }
    if (updatePlantInDto.geneticSequence !== undefined) {
      plant.geneticSequence = updatePlantInDto.geneticSequence;
    }

    const saved = await this.saveOrConflict(plant);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const plant = await this.findPlantOrFail(id);

    const susceptibilities = await this.susceptibilityRepository.count({ where: { plantId: id } });
    if (susceptibilities > 0) {
      throw new ConflictException(
        `No se puede eliminar la planta ${id} porque tiene ${susceptibilities} susceptibilidad(es) registrada(s)`,
      );
    }

    const crops = await this.cropRepository.count({ where: { plantId: id } });
    if (crops > 0) {
      throw new ConflictException(`No se puede eliminar la planta ${id} porque tiene ${crops} cultivo(s) registrado(s)`);
    }
    // Cuando exista el módulo de brotes, aquí también se debe verificar
    // que ningún brote tenga este plantId antes de borrar (409).

    await this.plantRepository.remove(plant);
  }

  async findDiseases(id: number, level?: SusceptibilityLevel): Promise<PlantDiseasesOutDto> {
    const plant = await this.findPlantOrFail(id);

    const where: FindOptionsWhere<Susceptibility> = { plantId: id };
    if (level !== undefined) {
      where.level = level;
    }
    const susceptibilities = await this.susceptibilityRepository.find({ where });

    if (susceptibilities.length === 0) {
      return { plant: this.toOutDto(plant), diseases: [] };
    }

    const diseaseIds = susceptibilities.map((susceptibility) => susceptibility.diseaseId);
    const diseases = await this.diseaseRepository.findBy({ id: In(diseaseIds) });
    const treatments = await this.treatmentRepository.findBy({ diseaseId: In(diseaseIds) });

    const result: PlantDiseaseOutDto[] = [];
    for (const susceptibility of susceptibilities) {
      const disease = diseases.find((item) => item.id === susceptibility.diseaseId);
      if (disease == null) {
        continue;
      }
      const diseaseTreatments = treatments
        .filter((treatment) => treatment.diseaseId === disease.id)
        .map((treatment) => ({
          id: treatment.id,
          name: treatment.name,
          applicationDescription: treatment.applicationDescription,
          treatmentType: treatment.treatmentType,
          diseaseId: treatment.diseaseId,
        }));

      result.push({
        diseaseId: disease.id,
        name: disease.name,
        symptoms: disease.symptoms,
        riskSeason: disease.riskSeason,
        susceptibilityLevel: susceptibility.level,
        treatments: diseaseTreatments,
      });
    }

    return { plant: this.toOutDto(plant), diseases: result };
  }

  private async findPlantOrFail(id: number): Promise<Plant> {
    const plant = await this.plantRepository.findOneBy({ id });
    if (plant == null) {
      throw new NotFoundException(`No se encontró la planta con id ${id}`);
    }
    return plant;
  }

  private async checkScientificNameIsFree(scientificName: string, excludeId?: number): Promise<void> {
    const where: FindOptionsWhere<Plant> = { scientificName };
    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }
    const existing = await this.plantRepository.findOneBy(where);
    if (existing != null) {
      throw new ConflictException(`Ya existe una planta con el nombre científico '${scientificName}'`);
    }
  }

  private async saveOrConflict(plant: Plant): Promise<Plant> {
    try {
      return await this.plantRepository.save(plant);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Ya existe una planta con el nombre científico '${plant.scientificName}'`);
      }
      throw error;
    }
  }

  private toOutDto(plant: Plant): PlantOutDto {
    return {
      id: plant.id,
      commonName: plant.commonName,
      scientificName: plant.scientificName,
      botanicalFamily: plant.botanicalFamily,
      cropType: plant.cropType,
      geneticSequence: plant.geneticSequence,
    };
  }
}
