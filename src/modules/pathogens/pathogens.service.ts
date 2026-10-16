import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { PathogensServiceInterface } from './pathogens-service-interface.js';
import { Pathogen } from './entities/pathogen.entity.js';
import { CreatePathogenInDto } from './dtos/create-pathogen-in-dto.js';
import { UpdatePathogenInDto } from './dtos/update-pathogen-in-dto.js';
import { PathogenFilterInDto } from './dtos/pathogen-filter-in-dto.js';
import { PathogenOutDto } from './dtos/pathogen-out-dto.js';

@Injectable()
export class PathogensService implements PathogensServiceInterface {
  constructor(
    @InjectRepository(Pathogen)
    private readonly pathogenRepository: Repository<Pathogen>,
  ) {}

  async findAll(filters: PathogenFilterInDto): Promise<PathogenOutDto[]> {
    const where: FindOptionsWhere<Pathogen> = {};
    if (filters.pathogenType !== undefined) {
      where.pathogenType = filters.pathogenType;
    }
    if (filters.transmissionMode !== undefined) {
      where.transmissionMode = Like(`%${filters.transmissionMode}%`);
    }

    let pathogens: Pathogen[];
    if (filters.name !== undefined) {
      pathogens = await this.pathogenRepository.find({
        where: [
          { ...where, name: Like(`%${filters.name}%`) },
          { ...where, scientificName: Like(`%${filters.name}%`) },
        ],
      });
    } else {
      pathogens = await this.pathogenRepository.find({ where });
    }
    return pathogens.map((pathogen) => this.toOutDto(pathogen));
  }

  async findOne(id: number): Promise<PathogenOutDto> {
    const pathogen = await this.findPathogenOrFail(id);
    return this.toOutDto(pathogen);
  }

  async create(createPathogenInDto: CreatePathogenInDto): Promise<PathogenOutDto> {
    await this.checkScientificNameIsFree(createPathogenInDto.scientificName);

    const pathogen = new Pathogen();
    pathogen.name = createPathogenInDto.name;
    pathogen.scientificName = createPathogenInDto.scientificName;
    pathogen.pathogenType = createPathogenInDto.pathogenType;
    pathogen.transmissionMode = createPathogenInDto.transmissionMode;
    pathogen.geneticSequence = createPathogenInDto.geneticSequence;

    const saved = await this.saveOrConflict(pathogen);
    return this.toOutDto(saved);
  }

  async update(id: number, updatePathogenInDto: UpdatePathogenInDto): Promise<PathogenOutDto> {
    const pathogen = await this.findPathogenOrFail(id);

    if (updatePathogenInDto.scientificName !== undefined) {
      await this.checkScientificNameIsFree(updatePathogenInDto.scientificName, id);
      pathogen.scientificName = updatePathogenInDto.scientificName;
    }
    if (updatePathogenInDto.name !== undefined) {
      pathogen.name = updatePathogenInDto.name;
    }
    if (updatePathogenInDto.pathogenType !== undefined) {
      pathogen.pathogenType = updatePathogenInDto.pathogenType;
    }
    if (updatePathogenInDto.transmissionMode !== undefined) {
      pathogen.transmissionMode = updatePathogenInDto.transmissionMode;
    }
    if (updatePathogenInDto.geneticSequence !== undefined) {
      pathogen.geneticSequence = updatePathogenInDto.geneticSequence;
    }

    const saved = await this.saveOrConflict(pathogen);
    return this.toOutDto(saved);
  }

  async remove(id: number): Promise<void> {
    const pathogen = await this.findPathogenOrFail(id);
    // Cuando exista el módulo de enfermedades, aquí se debe verificar
    // que ninguna enfermedad tenga este pathogenId antes de borrar (409).
    await this.pathogenRepository.remove(pathogen);
  }

  private async findPathogenOrFail(id: number): Promise<Pathogen> {
    const pathogen = await this.pathogenRepository.findOneBy({ id });
    if (pathogen == null) {
      throw new NotFoundException(`No se encontró el patógeno con id ${id}`);
    }
    return pathogen;
  }

  private async checkScientificNameIsFree(scientificName: string, excludeId?: number): Promise<void> {
    const where: FindOptionsWhere<Pathogen> = { scientificName };
    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }
    const existing = await this.pathogenRepository.findOneBy(where);
    if (existing != null) {
      throw new ConflictException(`Ya existe un patógeno con el nombre científico '${scientificName}'`);
    }
  }

  private async saveOrConflict(pathogen: Pathogen): Promise<Pathogen> {
    try {
      return await this.pathogenRepository.save(pathogen);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Ya existe un patógeno con el nombre científico '${pathogen.scientificName}'`);
      }
      throw error;
    }
  }

  private toOutDto(pathogen: Pathogen): PathogenOutDto {
    return {
      id: pathogen.id,
      name: pathogen.name,
      scientificName: pathogen.scientificName,
      pathogenType: pathogen.pathogenType,
      transmissionMode: pathogen.transmissionMode,
      geneticSequence: pathogen.geneticSequence,
    };
  }
}