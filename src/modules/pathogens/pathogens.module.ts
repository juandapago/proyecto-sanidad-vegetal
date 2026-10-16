import { Module } from '@nestjs/common';
import { PathogensController } from './pathogens.controller.js';
import { PathogensService } from './pathogens.service.js';

@Module({
  controllers: [PathogensController],
  providers: [PathogensService]
})
export class PathogensModule {}
