import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treatment } from './entities/treatment.entity.js';
import { Disease } from '../diseases/entities/disease.entity.js';
import { TreatmentsController } from './treatments.controller.js';
import { TreatmentsService } from './treatments.service.js';
import { TREATMENTS_SERVICE } from './token.js';

@Module({
  imports: [TypeOrmModule.forFeature([Treatment, Disease])],
  controllers: [TreatmentsController],
  providers: [
    {
      provide: TREATMENTS_SERVICE,
      useClass: TreatmentsService,
    },
  ],
})
export class TreatmentsModule {}