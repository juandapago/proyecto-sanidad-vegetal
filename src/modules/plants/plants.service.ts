import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { PlantsServiceInterface } from './plants-service-interface.js';
import { Plant } from './entities/plant.entity.js';
import { CreatePlantInDto } from './dtos/create-plant-in-dto.js';
import { UpdatePlantInDto } from './dtos/update-plant-in-dto.js';
import { PlantFilterInDto } from './dtos/plant-filter-in-dto.js';
import { PlantOutDto } from './dtos/plant-out-dto.js';

@Injectable()
export class PlantsService implements PlantsServiceInterface {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
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
    // Cuando existan susceptibilidades, cultivos y brotes, aquí se debe
    // verificar que ninguno tenga este plantId antes de borrar (409).
    await this.plantRepository.remove(plant);
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