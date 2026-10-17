import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { OutbreaksServiceInterface } from './outbreaks-service-interface.js';
import { Outbreak } from './entities/outbreak.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { CreateOutbreakInDto } from './dtos/create-outbreak-in-dto.js';
import { UpdateOutbreakInDto } from './dtos/update-outbreak-in-dto.js';
import { OutbreakFilterInDto } from './dtos/outbreak-filter-in-dto.js';
import { OutbreakOutDto } from './dtos/outbreak-out-dto.js';
import { Pathogen } from '../pathogens/entities/pathogen.entity.js';
import { Treatment } from '../treatments/entities/treatment.entity.js';
import { OutbreakDetailsOutDto } from './dtos/outbreak-details-out-dto.js';

@Injectable()
export class OutbreaksService implements OutbreaksServiceInterface {
  constructor(
    @InjectRepository(Outbreak)
    private readonly outbreakRepository: Repository<Outbreak>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Pathogen)
    private readonly pathogenRepository: Repository<Pathogen>,
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
  ) {}

  async findAll(filters: OutbreakFilterInDto): Promise<OutbreakOutDto[]> {
    const where: FindOptionsWhere<Outbreak> = {};
    if (filters.plantId !== undefined) {
      where.plantId = filters.plantId;
    }
    if (filters.diseaseId !== undefined) {
      where.diseaseId = filters.diseaseId;
    }
    if (filters.region !== undefined) {
      where.region = Like(`%${filters.region}%`);
    }
    if (filters.from !== undefined && filters.to !== undefined) {
      where.reportDate = Between(filters.from, filters.to);
    } else if (filters.from !== undefined) {
      where.reportDate = MoreThanOrEqual(filters.from);
    } else if (filters.to !== undefined) {
      where.reportDate = LessThanOrEqual(filters.to);
    }
    if (filters.minHectares !== undefined) {
      where.affectedHectares = MoreThanOrEqual(filters.minHectares);
    }
    const outbreaks = await this.outbreakRepository.find({ where });
    return outbreaks.map((outbreak) => this.toOutDto(outbreak));
  }

  async findOne(id: number): Promise<OutbreakOutDto> {
    const outbreak = await this.findOutbreakOrFail(id);
    return this.toOutDto(outbreak);
  }

  async create(createOutbreakInDto: CreateOutbreakInDto): Promise<OutbreakOutDto> {
    await this.checkPlantExists(createOutbreakInDto.plantId);
    await this.checkDiseaseExists(createOutbreakInDto.diseaseId);

    const outbreak = new Outbreak();
    outbreak.plantId = createOutbreakInDto.plantId;
    outbreak.diseaseId = createOutbreakInDto.diseaseId;
    outbreak.reportDate = createOutbreakInDto.reportDate;
    outbreak.region = createOutbreakInDto.region;
    outbreak.affectedHectares = createOutbreakInDto.affectedHectares;

    const saved = await this.outbreakRepository.save(outbreak);
    return this.toOutDto(saved);
  }

  async update(id: number, updateOutbreakInDto: UpdateOutbreakInDto): Promise<OutbreakOutDto> {
    const outbreak = await this.findOutbreakOrFail(id);

    if (updateOutbreakInDto.plantId !== undefined) {
      await this.checkPlantExists(updateOutbreakInDto.plantId);
      outbreak.plantId = updateOutbreakInDto.plantId;
    }
    if (updateOutbreakInDto.diseaseId !== undefined) {
      await this.checkDiseaseExists(updateOutbreakInDto.diseaseId);
      outbreak.diseaseId = updateOutbreakInDto.diseaseId;
    }
    if (updateOutbreakInDto.reportDate !== undefined) {
      outbreak.reportDate = updateOutbreakInDto.reportDate;
    }
    if (updateOutbreakInDto.region !== undefined) {
      outbreak.region = updateOutbreakInDto.region;
    }
    if (updateOutbreakInDto.affectedHectares !== undefined) {
      outbreak.affectedHectares = updateOutbreakInDto.affectedHectares;
    }

    const saved = await this.outbreakRepository.save(outbreak);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const outbreak = await this.findOutbreakOrFail(id);
    await this.outbreakRepository.remove(outbreak);
  }

    async findDetails(id: number): Promise<OutbreakDetailsOutDto> {
    const outbreak = await this.findOutbreakOrFail(id);

    const plant = await this.plantRepository.findOneBy({ id: outbreak.plantId });
    if (plant == null) {
      throw new NotFoundException(`No se encontró la planta con id ${outbreak.plantId}`);
    }

    const disease = await this.diseaseRepository.findOneBy({ id: outbreak.diseaseId });
    if (disease == null) {
      throw new NotFoundException(`No se encontró la enfermedad con id ${outbreak.diseaseId}`);
    }

    const pathogen = await this.pathogenRepository.findOneBy({ id: disease.pathogenId });
    if (pathogen == null) {
      throw new NotFoundException(`No se encontró el patógeno con id ${disease.pathogenId}`);
    }

    const treatments = await this.treatmentRepository.findBy({ diseaseId: disease.id });

    return {
      outbreak: this.toOutDto(outbreak),
      plant: {
        id: plant.id,
        commonName: plant.commonName,
        scientificName: plant.scientificName,
        botanicalFamily: plant.botanicalFamily,
        cropType: plant.cropType,
        geneticSequence: plant.geneticSequence,
      },
      disease: {
        id: disease.id,
        name: disease.name,
        symptoms: disease.symptoms,
        riskSeason: disease.riskSeason,
        pathogenId: disease.pathogenId,
      },
      pathogen: {
        id: pathogen.id,
        name: pathogen.name,
        scientificName: pathogen.scientificName,
        pathogenType: pathogen.pathogenType,
        transmissionMode: pathogen.transmissionMode,
        geneticSequence: pathogen.geneticSequence,
      },
      treatments: treatments.map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
        applicationDescription: treatment.applicationDescription,
        treatmentType: treatment.treatmentType,
        diseaseId: treatment.diseaseId,
      })),
    };
  }

  private async findOutbreakOrFail(id: number): Promise<Outbreak> {
    const outbreak = await this.outbreakRepository.findOneBy({ id });
    if (outbreak == null) {
      throw new NotFoundException(`No se encontró el brote con id ${id}`);
    }
    return outbreak;
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

  private toOutDto(outbreak: Outbreak): OutbreakOutDto {
    return {
      id: outbreak.id,
      plantId: outbreak.plantId,
      diseaseId: outbreak.diseaseId,
      reportDate: outbreak.reportDate,
      region: outbreak.region,
      affectedHectares: Number(outbreak.affectedHectares),
    };
  }
}