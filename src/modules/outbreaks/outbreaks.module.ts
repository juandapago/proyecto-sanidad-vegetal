import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbreak } from './entities/outbreak.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { OutbreaksController } from './outbreaks.controller.js';
import { OutbreaksService } from './outbreaks.service.js';
import { OUTBREAKS_SERVICE } from './token.js';
import { Pathogen } from '../pathogens/entities/pathogen.entity.js';
import { Treatment } from '../treatments/entities/treatment.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([Outbreak, Plant, Disease, Pathogen, Treatment])],  controllers: [OutbreaksController],
  providers: [
    {
      provide: OUTBREAKS_SERVICE,
      useClass: OutbreaksService,
    },
  ],
})
export class OutbreaksModule {}