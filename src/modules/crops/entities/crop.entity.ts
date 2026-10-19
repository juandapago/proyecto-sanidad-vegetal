import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plantId: number;

  @Column({ type: 'varchar', length: 100 })
  lot: string;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'date' })
  sowingDate: string;

  @Column({ type: 'text' })
  seedGeneticCode: string;
}