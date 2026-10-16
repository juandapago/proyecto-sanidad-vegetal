import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TreatmentType } from '../enums/treatment-type.enum.js';

@Entity('treatments')
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  applicationDescription: string;

  @Column({ type: 'enum', enum: TreatmentType })
  treatmentType: TreatmentType;

  @Column()
  diseaseId: number;
}