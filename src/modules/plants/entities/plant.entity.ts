import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CropType } from '../enums/crop-type.enum.js';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  commonName: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  scientificName: string;

  @Column({ type: 'varchar', length: 100 })
  botanicalFamily: string;

  @Column({ type: 'enum', enum: CropType })
  cropType: CropType;

  @Column({ type: 'text' })
  geneticSequence: string;
}