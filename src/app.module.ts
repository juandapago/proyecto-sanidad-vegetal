import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './modules/shared/infrastructure/mysql/mysql.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}