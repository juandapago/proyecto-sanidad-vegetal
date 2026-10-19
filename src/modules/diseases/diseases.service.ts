import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { DiseasesServiceInterface } from './diseases-service-interface.js';
import { Disease } from './entities/disease.entity.js';
import { Pathogen } from '../pathogens/entities/pathogen.entity.js';
import { CreateDiseaseInDto } from './dtos/create-disease-in-dto.js';
import { UpdateDiseaseInDto } from './dtos/update-disease-in-dto.js';
import { DiseaseFilterInDto } from './dtos/disease-filter-in-dto.js';
import { DiseaseOutDto } from './dtos/disease-out-dto.js';
import { DiseaseDetailsOutDto } from './dtos/disease-details-out-dto.js';
import { Treatment } from '../treatments/entities/treatment.entity.js';
import { Susceptibility } from '../susceptibilities/entities/susceptibility.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';

@Injectable()
export class DiseasesService implements DiseasesServiceInterface {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Pathogen)
    private readonly pathogenRepository: Repository<Pathogen>,
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
    @InjectRepository(Susceptibility)
    private readonly susceptibilityRepository: Repository<Susceptibility>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(Outbreak)
    private readonly outbreakRepository: Repository<Outbreak>,
  ) {}

  async findAll(filters: DiseaseFilterInDto): Promise<DiseaseOutDto[]> {
    const where: FindOptionsWhere<Disease> = {};
    if (filters.name !== undefined) {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters.riskSeason !== undefined) {
      where.riskSeason = filters.riskSeason;
    }
    if (filters.pathogenId !== undefined) {
      where.pathogenId = filters.pathogenId;
    }
    const diseases = await this.diseaseRepository.find({ where });
    return diseases.map((disease) => this.toOutDto(disease));
  }

  async findOne(id: number): Promise<DiseaseOutDto> {
    const disease = await this.findDiseaseOrFail(id);
    return this.toOutDto(disease);
  }

  async create(createDiseaseInDto: CreateDiseaseInDto): Promise<DiseaseOutDto> {
    await this.checkPathogenExists(createDiseaseInDto.pathogenId);
    await this.checkNameIsFree(createDiseaseInDto.name);

    const disease = new Disease();
    disease.name = createDiseaseInDto.name;
    disease.symptoms = createDiseaseInDto.symptoms;
    disease.riskSeason = createDiseaseInDto.riskSeason;
    disease.pathogenId = createDiseaseInDto.pathogenId;

    const saved = await this.saveOrConflict(disease);
    return this.toOutDto(saved);
  }

  async update(id: number, updateDiseaseInDto: UpdateDiseaseInDto): Promise<DiseaseOutDto> {
    const disease = await this.findDiseaseOrFail(id);

    if (updateDiseaseInDto.pathogenId !== undefined) {
      await this.checkPathogenExists(updateDiseaseInDto.pathogenId);
      disease.pathogenId = updateDiseaseInDto.pathogenId;
    }
    if (updateDiseaseInDto.name !== undefined) {
      await this.checkNameIsFree(updateDiseaseInDto.name, id);
      disease.name = updateDiseaseInDto.name;
    }
    if (updateDiseaseInDto.symptoms !== undefined) {
      disease.symptoms = updateDiseaseInDto.symptoms;
    }
    if (updateDiseaseInDto.riskSeason !== undefined) {
      disease.riskSeason = updateDiseaseInDto.riskSeason;
    }

    const saved = await this.saveOrConflict(disease);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const disease = await this.findDiseaseOrFail(id);

    const treatments = await this.treatmentRepository.count({ where: { diseaseId: id } });
    if (treatments > 0) {
      throw new ConflictException(
        `No se puede eliminar la enfermedad ${id} porque tiene ${treatments} tratamiento(s) registrado(s)`,
      );
    }

    const susceptibilities = await this.susceptibilityRepository.count({ where: { diseaseId: id } });
    if (susceptibilities > 0) {
      throw new ConflictException(
        `No se puede eliminar la enfermedad ${id} porque tiene ${susceptibilities} susceptibilidad(es) registrada(s)`,
      );
    }

    const outbreaks = await this.outbreakRepository.count({ where: { diseaseId: id } });
    if (outbreaks > 0) {
      throw new ConflictException(`No se puede eliminar la enfermedad ${id} porque tiene ${outbreaks} brote(s) registrado(s)`);
    }

    await this.diseaseRepository.remove(disease);
  }

  async findDetails(id: number): Promise<DiseaseDetailsOutDto> {
    const disease = await this.findDiseaseOrFail(id);

    const pathogen = await this.pathogenRepository.findOneBy({ id: disease.pathogenId });
    if (pathogen == null) {
      throw new NotFoundException(`No se encontró el patógeno con id ${disease.pathogenId}`);
    }

    const treatments = await this.treatmentRepository.findBy({ diseaseId: id });

    const susceptibilities = await this.susceptibilityRepository.findBy({ diseaseId: id });
    const plantIds = susceptibilities.map((susceptibility) => susceptibility.plantId);
    const plants = plantIds.length > 0 ? await this.plantRepository.findBy({ id: In(plantIds) }) : [];

    const outbreaks = await this.outbreakRepository.findBy({ diseaseId: id });
    let totalAffectedHectares = 0;
    outbreaks.forEach((outbreak) => {
      totalAffectedHectares += Number(outbreak.affectedHectares);
    });

    return {
      disease: this.toOutDto(disease),
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
      affectedPlants: susceptibilities.map((susceptibility) => {
        const plant = plants.find((p) => p.id === susceptibility.plantId);
        return {
          plantId: susceptibility.plantId,
          commonName: plant ? plant.commonName : '',
          scientificName: plant ? plant.scientificName : '',
          susceptibilityLevel: susceptibility.level,
        };
      }),
      totalOutbreaks: outbreaks.length,
      totalAffectedHectares: Math.round(totalAffectedHectares * 100) / 100,
    };
  }

  private async findDiseaseOrFail(id: number): Promise<Disease> {
    const disease = await this.diseaseRepository.findOneBy({ id });
    if (disease == null) {
      throw new NotFoundException(`No se encontró la enfermedad con id ${id}`);
    }
    return disease;
  }

  private async checkPathogenExists(pathogenId: number): Promise<void> {
    const exists = await this.pathogenRepository.existsBy({ id: pathogenId });
    if (!exists) {
      throw new NotFoundException(`No se encontró el patógeno con id ${pathogenId}`);
    }
  }

  private async checkNameIsFree(name: string, excludeId?: number): Promise<void> {
    const where: FindOptionsWhere<Disease> = { name };
    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }
    const existing = await this.diseaseRepository.findOneBy(where);
    if (existing != null) {
      throw new ConflictException(`Ya existe una enfermedad con el nombre '${name}'`);
    }
  }

  private async saveOrConflict(disease: Disease): Promise<Disease> {
    try {
      return await this.diseaseRepository.save(disease);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Ya existe una enfermedad con el nombre '${disease.name}'`);
      }
      throw error;
    }
  }

  private toOutDto(disease: Disease): DiseaseOutDto {
    return {
      id: disease.id,
      name: disease.name,
      symptoms: disease.symptoms,
      riskSeason: disease.riskSeason,
      pathogenId: disease.pathogenId,
    };
  }
}