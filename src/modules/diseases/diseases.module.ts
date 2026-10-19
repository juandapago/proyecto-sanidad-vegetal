import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity.js';
import { Pathogen } from '../pathogens/entities/pathogen.entity.js';
import { Treatment } from '../treatments/entities/treatment.entity.js';
import { Susceptibility } from '../susceptibilities/entities/susceptibility.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';
import { DiseasesController } from './diseases.controller.js';
import { DiseasesService } from './diseases.service.js';
import { DISEASES_SERVICE } from './token.js';

@Module({
  imports: [TypeOrmModule.forFeature([Disease, Pathogen, Treatment, Susceptibility, Plant, Outbreak])],
  controllers: [DiseasesController],
  providers: [
    {
      provide: DISEASES_SERVICE,
      useClass: DiseasesService,
    },
  ],
})
export class DiseasesModule {}