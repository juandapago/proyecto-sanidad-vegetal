import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entities/plant.entity.js';
import { Susceptibility } from '../susceptibilities/entities/susceptibility.entity.js';
import { Crop } from '../crops/entities/crop.entity.js';
import { PlantsController } from './plants.controller.js';
import { PlantsService } from './plants.service.js';
import { PLANTS_SERVICE } from './token.js';

@Module({
  imports: [TypeOrmModule.forFeature([Plant, Susceptibility, Crop])],
  controllers: [PlantsController],
  providers: [
    {
      provide: PLANTS_SERVICE,
      useClass: PlantsService,
    },
  ],
})
export class PlantsModule {}
