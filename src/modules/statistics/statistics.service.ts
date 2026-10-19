import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { StatisticsServiceInterface } from './statistics-service-interface.js';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Pathogen } from '../pathogens/entities/pathogen.entity.js';
import { StatisticsFilterInDto } from './dtos/statistics-filter-in-dto.js';
import { OutbreakGroupOutDto } from './dtos/outbreak-group-out-dto.js';
import { RegionOutbreakOutDto } from './dtos/region-outbreak-out-dto.js';

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
    @InjectRepository(Pathogen)
    private readonly pathogenRepository: Repository<Pathogen>,
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

  // Dos saltos: brote -> enfermedad -> patógeno. Primero se agrupa por enfermedad en SQL,
  // luego se suma por patógeno en código (la enfermedad guarda el id de su patógeno).
  async byPathogen(filters: StatisticsFilterInDto): Promise<OutbreakGroupOutDto[]> {
    const diseaseRows = await this.groupOutbreaksBy('diseaseId', filters);
    if (diseaseRows.length === 0) {
      return [];
    }
    const diseases = await this.diseaseRepository.findBy({ id: In(diseaseRows.map((row) => row.id)) });

    const totals = new Map<number, GroupRow>();
    for (const row of diseaseRows) {
      const disease = diseases.find((item) => item.id === row.id);
      if (disease === undefined) {
        continue;
      }
      const total = totals.get(disease.pathogenId) ?? { id: disease.pathogenId, outbreaks: 0, hectares: 0 };
      total.outbreaks += row.outbreaks;
      total.hectares += row.hectares;
      totals.set(disease.pathogenId, total);
    }

    const sorted = this.sortGroups([...totals.values()]);
    const limited = this.applyLimit(sorted, filters.limit);
    if (limited.length === 0) {
      return [];
    }
    const pathogens = await this.pathogenRepository.findBy({ id: In(limited.map((row) => row.id)) });
    return limited.map((row) => ({
      id: row.id,
      name: pathogens.find((pathogen) => pathogen.id === row.id)?.name ?? `Patógeno ${row.id}`,
      outbreaks: row.outbreaks,
      hectares: this.round(row.hectares),
    }));
  }

  // Agrupa por (región, enfermedad) en SQL y luego arma cada región en código:
  // suma sus brotes y hectáreas y se queda con la enfermedad que más brotes tiene.
  async byRegion(filters: StatisticsFilterInDto): Promise<RegionOutbreakOutDto[]> {
    const query = this.outbreakRepository
      .createQueryBuilder('o')
      .select('o.region', 'region')
      .addSelect('o.diseaseId', 'diseaseId')
      .addSelect('COUNT(*)', 'outbreaks')
      .addSelect('SUM(o.affectedHectares)', 'hectares')
      .groupBy('o.region')
      .addGroupBy('o.diseaseId');
    this.applyDateFilters(query, filters);

    const rows = await query.getRawMany<{ region: string; diseaseId: number | string; outbreaks: string; hectares: string }>();
    if (rows.length === 0) {
      return [];
    }

    interface RegionTotal {
      region: string;
      outbreaks: number;
      hectares: number;
      topDiseaseId: number;
      topOutbreaks: number;
      topHectares: number;
    }
    const regions = new Map<string, RegionTotal>();
    for (const row of rows) {
      const diseaseId = Number(row.diseaseId);
      const outbreaks = Number(row.outbreaks);
      const hectares = Number(row.hectares);
      const current = regions.get(row.region);
      if (current === undefined) {
        regions.set(row.region, {
          region: row.region,
          outbreaks,
          hectares,
          topDiseaseId: diseaseId,
          topOutbreaks: outbreaks,
          topHectares: hectares,
        });
        continue;
      }
      current.outbreaks += outbreaks;
      current.hectares += hectares;
      // Desempate: si dos enfermedades tienen los mismos brotes, gana la de más hectáreas
      if (outbreaks > current.topOutbreaks || (outbreaks === current.topOutbreaks && hectares > current.topHectares)) {
        current.topDiseaseId = diseaseId;
        current.topOutbreaks = outbreaks;
        current.topHectares = hectares;
      }
    }

    const sorted = [...regions.values()].sort((a, b) => b.outbreaks - a.outbreaks || b.hectares - a.hectares);
    const limited = this.applyLimit(sorted, filters.limit);
    const diseases = await this.diseaseRepository.findBy({ id: In(limited.map((item) => item.topDiseaseId)) });
    return limited.map((item) => ({
      region: item.region,
      outbreaks: item.outbreaks,
      hectares: this.round(item.hectares),
      mostFrequentDisease: {
        id: item.topDiseaseId,
        name: diseases.find((disease) => disease.id === item.topDiseaseId)?.name ?? `Enfermedad ${item.topDiseaseId}`,
        outbreaks: item.topOutbreaks,
      },
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
    this.applyDateFilters(query, filters);

    const rows = await query.getRawMany<{ groupId: number | string; outbreaks: string; hectares: string }>();
    return rows.map((row) => ({
      id: Number(row.groupId),
      outbreaks: Number(row.outbreaks),
      hectares: this.round(Number(row.hectares)),
    }));
  }

  private applyDateFilters(query: SelectQueryBuilder<Outbreak>, filters: StatisticsFilterInDto): void {
    if (filters.from !== undefined) {
      query.andWhere('o.reportDate >= :from', { from: filters.from });
    }
    if (filters.to !== undefined) {
      query.andWhere('o.reportDate <= :to', { to: filters.to });
    }
  }

  private sortGroups(rows: GroupRow[]): GroupRow[] {
    return rows.sort((a, b) => b.outbreaks - a.outbreaks || b.hectares - a.hectares);
  }

  private applyLimit<T>(rows: T[], limit?: number): T[] {
    return limit === undefined ? rows : rows.slice(0, limit);
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}