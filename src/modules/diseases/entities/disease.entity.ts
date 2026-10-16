import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RiskSeason } from '../enums/risk-season.enum.js';

@Entity('diseases')
export class Disease {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text' })
  symptoms: string;

  @Column({ type: 'enum', enum: RiskSeason })
  riskSeason: RiskSeason;

  @Column()
  pathogenId: number;
}