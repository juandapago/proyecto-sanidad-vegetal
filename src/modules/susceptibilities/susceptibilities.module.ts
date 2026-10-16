import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Susceptibility } from './entities/susceptibility.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { SusceptibilitiesController } from './susceptibilities.controller.js';
import { SusceptibilitiesService } from './susceptibilities.service.js';
import { SUSCEPTIBILITIES_SERVICE } from './token.js';

@Module({
  imports: [TypeOrmModule.forFeature([Susceptibility, Plant, Disease])],
  controllers: [SusceptibilitiesController],
  providers: [
    {
      provide: SUSCEPTIBILITIES_SERVICE,
      useClass: SusceptibilitiesService,
    },
  ],
})
export class SusceptibilitiesModule {}