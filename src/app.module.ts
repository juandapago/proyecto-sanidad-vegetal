import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './modules/shared/infrastructure/mysql/mysql.module.js';
import { PathogensModule } from './modules/pathogens/pathogens.module.js';
import { DiseasesModule } from './modules/diseases/diseases.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, PathogensModule, DiseasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}