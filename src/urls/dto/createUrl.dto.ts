import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUrlDTO {
  @IsUrl() //{host_blacklist: }
  readonly url: string;

  @IsString()
  @Length(1, 100)
  @IsOptional()
  accessKey?: string;
}
