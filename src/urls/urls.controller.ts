import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { CreateUrlDTO } from './dto/createUrl.dto';
import { GetUrlStatDTO } from './dto/getUrlStat.dto';
import { UrlsService } from './urls.service';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('register')
  async shortenUrl(
    @Body() createUrlDTO: CreateUrlDTO,
  ): Promise<{ url: string }> {
    const result = await this.urlsService.shortenUrl(createUrlDTO);
    return result;
  }

  @Get(':key')
  @Redirect()
  async redirectToUrl(
    @Param('key') accessKey: string,
  ): Promise<{ url: string; statusCode: number }> {
    const redirectUrl = await this.urlsService.getRedirectUrl(accessKey);
    return {
      url: redirectUrl.url,
      statusCode: 302,
    };
  }

  @Get(':key/stat')
  async getUrlStat(@Param('key') accessKey: string): Promise<GetUrlStatDTO> {
    const urlStat = await this.urlsService.getUrlStat(accessKey);
    return urlStat;
  }
}
