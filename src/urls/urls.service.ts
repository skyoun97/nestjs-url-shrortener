import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, FindOneOptions, Repository } from 'typeorm';
import { CreateUrlDTO } from './dto/createUrl.dto';
import { GetUrlStatDTO } from './dto/getUrlStat.dto';
import { UrlLogs } from './entities/urlLogs.entity';
import { Url } from './entities/urls.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url) private urlsRepository: Repository<Url>,
    @InjectRepository(UrlLogs) private urlLogsRepository: Repository<UrlLogs>,
    private configService: ConfigService,
    private connection: Connection, // for transaction
  ) {}

  async shortenUrl(createUrlDTO: CreateUrlDTO): Promise<{ url: string }> {
    const customAccessKey = createUrlDTO.accessKey;
    if (customAccessKey === undefined) {
      createUrlDTO.accessKey = await this._getRandomUniqueAccessKey();
    } else {
      await this._validateCustomAccessKey(customAccessKey);
    }

    const newUrl = await this.urlsRepository.save(createUrlDTO);

    return {
      url: `${this.configService.get<string>('rootUri')}/${newUrl.accessKey}`,
    };
  }

  async getRedirectUrl(accessKey: string): Promise<{ url: string }> {
    const existUrl = await this._getUrlByAccessKey(accessKey);

    const accessDateHour = this._getCurrentDateHour();
    const uniqueAccess = {
      url: existUrl,
      accessDateHour,
    };

    const existLog = await this.urlLogsRepository.findOne(uniqueAccess);
    if (existLog) {
      this.urlLogsRepository.increment(uniqueAccess, 'accessCount', 1);
    } else {
      this.urlLogsRepository.insert({ ...uniqueAccess, accessCount: 1 });
    }

    return { url: existUrl.url };
  }

  async getUrlStat(inputAccessKey: string): Promise<GetUrlStatDTO> {
    const existUrl = await this._getUrlByAccessKey(inputAccessKey, {
      relations: ['logs'],
    });
    const { url, accessKey, createDate, logs } = existUrl;
    return {
      url,
      accessKey,
      createDate,
      accessCounts: logs.map(log => ({
        Date: log.accessDateHour,
        count: log.accessCount,
      })),
      accessTotalCount: logs.reduce((acc, cur) => acc + cur.accessCount, 0),
    };
  }

  private async _getUrlByAccessKey(
    accessKey: string,
    option?: FindOneOptions<Url>,
  ): Promise<Url> {
    const existUrl = await this.urlsRepository.findOne({ accessKey }, option);
    if (!existUrl) throw new NotFoundException();
    return existUrl;
  }

  private async _validateCustomAccessKey(accessKey: string) {
    if ((await this._isUniqueAccessKey(accessKey)) === false) {
      throw new BadRequestException('Duplicate access key');
    }
  }

  private async _isUniqueAccessKey(accessKey: string): Promise<boolean> {
    const existUrl = await this.urlsRepository.findOne({ accessKey });
    if (existUrl) return false;
    return true;
  }

  private async _getRandomUniqueAccessKey(): Promise<string> {
    const randomAccessKey = this._getRandomAccessKey();
    if (await this._isUniqueAccessKey(randomAccessKey)) {
      return randomAccessKey;
    }
    throw new ServiceUnavailableException('Please, try again');
  }

  private _getCurrentDateHour() {
    let now = new Date();
    console.log(now.toUTCString());
    console.log(now.getTimezoneOffset());
    now = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
    const currentDateHour = now.toISOString().split(':')[0] + ':00:00';
    console.log(currentDateHour);
    return currentDateHour;
  }

  private _getRandomAccessKey(): string {
    return Math.random()
      .toString(36)
      .substr(2, 12);
  }
}
