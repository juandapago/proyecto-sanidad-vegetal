import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatisticsServiceInterface } from './statistics-service-interface.js';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { StatisticsFilterInDto } from './dtos/statistics-filter-in-dto.js';
import { OutbreakGroupOutDto } from './dtos/outbreak-group-out-dto.js';

interface GroupRow {
  id: number;
  outbreaks: number;
  hectares: number;
}

@Injectable()
export class StatisticsService implements StatisticsServiceInterface {
  constructor(
    @InjectRepository(Outbreak)
    private readonly outbreakRepository: Repository<Outbreak>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
  ) {}

  async byDisease(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]> {
    const rows = await this.groupOutbreaksBy('diseaseId', filters);
    const limited = this.applyLimit(rows, filters.limit);
    if (limited.length === 0) {
      return [];
    }
    const diseases = await this.diseaseRepository.findBy({ id: In(limited.map((row) => row.id)) });
    return limited.map((row) => ({
      id: row.id,
      name: diseases.find((disease) => disease.id === row.id)?.name ?? `Enfermedad ${row.id}`,
      outbreaks: row.outbreaks,
      hectares: row.hectares,
    }));
  }

  async byPlant(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]> {
    const rows = await this.groupOutbreaksBy('plantId', filters);
    const limited = this.applyLimit(rows, filters.limit);
    if (limited.length === 0) {
      return [];
    }
    const plants = await this.plantRepository.findBy({ id: In(limited.map((row) => row.id)) });
    return limited.map((row) => ({
      id: row.id,
      name: plants.find((plant) => plant.id === row.id)?.commonName ?? `Planta ${row.id}`,
      outbreaks: row.outbreaks,
      hectares: row.hectares,
    }));
  }

  // Agrupa los brotes por una columna (una sola tabla, sin joins) y cuenta brotes y hectáreas.
  // getRawMany devuelve los números como texto, por eso se convierten con Number().
  private async groupOutbreaksBy(column: 'diseaseId' | 'plantId', filters: StatisticsFilterInDto): Promise<GroupRow[]> {
    const query = this.outbreakRepository
      .createQueryBuilder('o')
      .select(`o.${column}`, 'groupId')
      .addSelect('COUNT(*)', 'outbreaks')
      .addSelect('SUM(o.affectedHectares)', 'hectares')
      .groupBy(`o.${column}`)
      .orderBy('outbreaks', 'DESC')
      .addOrderBy('hectares', 'DESC');

    if (filters.from !== undefined) {
      query.andWhere('o.reportDate >= :from', { from: filters.from });
    }
    if (filters.to !== undefined) {
      query.andWhere('o.reportDate <= :to', { to: filters.to });
    }

    const rows = await query.getRawMany<{ groupId: number | string; outbreaks: string; hectares: string }>();
    return rows.map((row) => ({
      id: Number(row.groupId),
      outbreaks: Number(row.outbreaks),
      hectares: this.round(Number(row.hectares)),
    }));
  }

  private applyLimit<T>(rows: T[], limit?: number): T[] {
    return limit === undefined ? rows : rows.slice(0, limit);
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}