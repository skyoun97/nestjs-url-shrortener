import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlLogs } from './entities/urlLogs.entity';
import { Url } from './entities/urls.entity';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url, UrlLogs])],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
