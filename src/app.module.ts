import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './modules/shared/infrastructure/mysql/mysql.module.js';
import { PathogensModule } from './modules/pathogens/pathogens.module.js';
import { DiseasesModule } from './modules/diseases/diseases.module.js';
import { TreatmentsModule } from './modules/treatments/treatments.module.js';
import { PlantsModule } from './modules/plants/plants.module.js';
import { SusceptibilitiesModule } from './modules/susceptibilities/susceptibilities.module.js';
import { CropsModule } from './modules/crops/crops.module.js';
import { OutbreaksModule } from './modules/outbreaks/outbreaks.module.js';
import { StatisticsModule } from './modules/statistics/statistics.module.js';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, PathogensModule, DiseasesModule, TreatmentsModule, PlantsModule, SusceptibilitiesModule, CropsModule, OutbreaksModule, StatisticsModule],
  providers: [],
})
export class AppModule {}

