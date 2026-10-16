import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './modules/shared/infrastructure/mysql/mysql.module.js';
import { PathogensModule } from './modules/pathogens/pathogens.module.js';
import { DiseasesModule } from './modules/diseases/diseases.module.js';
import { TreatmentsModule } from './modules/treatments/treatments.module.js';
import { PlantsModule } from './modules/plants/plants.module.js';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, PathogensModule, DiseasesModule, TreatmentsModule, PlantsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

