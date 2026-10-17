import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crop } from './entities/crop.entity.js';
import { Plant } from '../plants/entities/plant.entity.js';
import { CropsController } from './crops.controller.js';
import { CropsService } from './crops.service.js';
import { CROPS_SERVICE } from './token.js';
import { Susceptibility } from '../susceptibilities/entities/susceptibility.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { Outbreak } from '../outbreaks/entities/outbreak.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Crop, Plant, Susceptibility, Disease, Outbreak])],  controllers: [CropsController],
  providers: [
    {
      provide: CROPS_SERVICE,
      useClass: CropsService,
    },
  ],
})
export class CropsModule {}