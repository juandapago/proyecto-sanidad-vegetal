import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './modules/shared/infrastructure/mysql/mysql.module.js';
import { PathogensModule } from './modules/pathogens/pathogens.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, PathogensModule],
  controllers: [],
  providers: [],
})
export class AppModule {}