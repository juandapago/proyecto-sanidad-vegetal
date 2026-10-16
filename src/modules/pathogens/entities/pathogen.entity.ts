import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PathogenType } from '../enums/pathogen-type.enum.js';

@Entity('pathogens')
export class Pathogen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  scientificName: string;

  @Column({ type: 'enum', enum: PathogenType })
  pathogenType: PathogenType;

  @Column({ length: 100 })
  transmissionMode: string;

  @Column({ type: 'text' })
  geneticSequence: string;
}