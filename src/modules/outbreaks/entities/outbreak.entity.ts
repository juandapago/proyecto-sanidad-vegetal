import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('outbreaks')
export class Outbreak {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plantId: number;

  @Column()
  diseaseId: number;

  @Column({ type: 'date' })
  reportDate: string;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  // mysql2 devuelve los decimal como texto ("12.50"); se convierte con Number() al responder
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  affectedHectares: number;
}