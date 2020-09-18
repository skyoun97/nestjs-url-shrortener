import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlLogs } from './urls/entities/urlLogs.entity';
import { Url } from './urls/entities/urls.entity';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'phaphaya',
      database: 'nestjs_url_shortener',
      entities: [Url, UrlLogs],
      synchronize: true,
      autoLoadEntities: true, // testing
    }),
    UrlsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
