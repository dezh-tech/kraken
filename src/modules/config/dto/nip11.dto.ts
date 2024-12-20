import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { Nip11Entity } from '../entities/nip11.entity';
import { FeesDto } from './fees.dto';
import { RetentionDto } from './retention.dto';
import { LimitationDto } from './limitation.dto';

export class Nip11DTO extends AbstractDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  banner: string;

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
  supported_nips: number[];

  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  relay_countries: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  language_tags: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  tags: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  posting_policy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  payments_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ type: () => RetentionDto, required: false })
  @IsOptional()
  retention?: RetentionDto;

  @ApiProperty({ type: () => FeesDto, required: false })
  @IsOptional()
  fees?: FeesDto;

  @ApiProperty({ type: () => LimitationDto, required: false })
  @IsOptional()
  limitations?: LimitationDto;

  constructor(e: Nip11Entity) {
    super(e);

    this.name = e.name;
    this.description = e.description;
    this.pubkey = e.pubkey;
    this.contact = e.contact;
    this.banner = e.banner;
    this.software = e.software;
    this.supported_nips = e.supported_nips;
    this.version = e.version;
    this.relay_countries = e.relay_countries;
    this.language_tags = e.language_tags;
    this.tags = e.tags;
    this.posting_policy = e.posting_policy;
    this.payments_url = e.payments_url;
    this.icon = e.icon;
    this.url = e.url;
    this.retention = {
      count: e.retention?.count,
      kinds: e.retention?.kinds,
      time: e.retention?.time,
    };
    this.fees = {
      admission: e.fees?.admission?.map((a) => ({
        amount: a.amount,
        unit: a.unit,
      })),
      publication: e.fees?.publication?.map((p) => ({
        amount: p.amount,
        kinds: p.kinds,
        unit: p.unit,
      })),
      subscription: e.fees?.subscription?.map((s) => ({
        amount: s.amount,
        period: s.period,
        unit: s.unit,
      })),
    };

    this.limitations = {
      auth_required: e.limitations?.auth_required,
      max_message_length: e.limitations?.max_message_length,
      max_subid_length: e.limitations?.max_subid_length,
      max_filters: e.limitations?.max_filters,
      max_subscriptions: e.limitations?.max_subscriptions,
      min_pow_difficulty: e.limitations?.min_pow_difficulty,
      payment_required: e.limitations?.payment_required,
      restricted_writes: e.limitations?.restricted_writes,
      max_event_tags: e.limitations?.max_event_tags,
      max_content_length: e.limitations?.max_content_length,
      created_at_lower_limit: e.limitations?.created_at_lower_limit,
      created_at_upper_limit: e.limitations?.created_at_upper_limit,
      default_query_limit: e.limitations?.max_limit,
      max_limit: e.limitations?.max_limit,
    };
  }
}
