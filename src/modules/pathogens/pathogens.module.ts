import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pathogen } from './entities/pathogen.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { PathogensController } from './pathogens.controller.js';
import { PathogensService } from './pathogens.service.js';
import { PATHOGENS_SERVICE } from './token.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pathogen, Disease])],
  controllers: [PathogensController],
  providers: [
    {
      provide: PATHOGENS_SERVICE,
      useClass: PathogensService,
    },
  ],
})
export class PathogensModule {}