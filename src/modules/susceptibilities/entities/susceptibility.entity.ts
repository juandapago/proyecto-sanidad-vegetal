import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SusceptibilityLevel } from '../enums/susceptibility-level.enum.js';

@Entity('susceptibilities')
@Unique(['plantId', 'diseaseId'])
export class Susceptibility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plantId: number;

  @Column()
  diseaseId: number;

  @Column({ type: 'enum', enum: SusceptibilityLevel })
  level: SusceptibilityLevel;
}