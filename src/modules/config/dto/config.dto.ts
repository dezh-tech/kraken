import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ConfigEntity } from '../entities/config.entity';
import { Retention } from './retention.dto';

export class ConfigDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  pubkey: string;

  @ApiProperty()
  @IsString()
  contact: string;

  @ApiProperty()
  @IsString()
  software: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  supportedNips: number[];

  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  relayCountries: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  languageTags: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  tags: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postingPolicy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentsUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ type: () => Retention, required: false })
  @IsOptional()
  retention?: Retention;

  // @ApiProperty({ type: () => FeesClass, required: false })
  // @IsOptional()
  // fees?: FeesClass;

  constructor(e: ConfigEntity) {
    super(e);

    this.name = e.name;
    this.description = e.description;
    this.pubkey = e.pubkey;
    this.contact = e.contact;
    this.software = e.software;
    this.supportedNips = e.supportedNips;
    this.version = e.version;
    this.relayCountries = e.relayCountries;
    this.languageTags = e.languageTags;
    this.tags = e.tags;
    this.postingPolicy = e.postingPolicy;
    this.paymentsUrl = e.paymentsUrl;
    this.icon = e.icon;
    this.url = e.url;
    this.retention = {
      count: e.retention?.count,
      kinds: e.retention?.kinds,
      time: e.retention?.time,
    };
    // this.fees = e.fees;
  }
}
