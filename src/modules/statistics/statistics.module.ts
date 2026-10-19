import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Pathogen } from '../pathogens/entities/pathogen.entity.js';
import { StatisticsController } from './statistics.controller.js';
import { StatisticsService } from './statistics.service.js';
import { STATISTICS_SERVICE } from './token.js';

@Module({
  imports: [TypeOrmModule.forFeature([Outbreak, Disease, Plant, Pathogen])],
  controllers: [StatisticsController],
  providers: [
    {
      provide: STATISTICS_SERVICE,
      useClass: StatisticsService,
    },
  ],
})
export class StatisticsModule {}