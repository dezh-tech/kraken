import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { Nip11Entity } from '../entities/nip11.entity';
import { RetentionDto } from './retention.dto';
import { LimitationDto } from './limitation.dto';
import { FeesDto } from './fees.dto';

export class Nip11DTO extends AbstractDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  banner?: string;

  @ApiProperty()
  @IsString()
  pubkey?: string;

  @ApiProperty()
  @IsString()
  contact?: string;

  @ApiProperty()
  @IsString()
  software?: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  supported_nips?: number[];

  @ApiProperty()
  @IsString()
  version?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  onion_address?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  relay_countries?: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  language_tags?: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  tags?: string[];

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

  @ApiProperty({ type: () => [RetentionDto], required: false })
  @IsOptional()
  retention?: RetentionDto[];

  @ApiProperty({ type: () => FeesDto, required: false })
  @IsOptional()
  fees?: FeesDto;

  @ApiProperty({ type: () => LimitationDto, required: false })
  @IsOptional()
  limitation?: LimitationDto;

  constructor(e: Nip11Entity) {
    super(e);

    this.name = e.name ?? undefined;
    this.description = e.description ?? undefined;
    this.banner = e.banner ?? undefined;
    this.pubkey = e.pubkey ?? undefined;
    this.contact = e.contact ?? undefined;
    this.software = e.software ?? undefined;
    this.supported_nips = e.supported_nips ?? undefined;
    this.version = e.version ?? undefined;
    this.relay_countries = e.relay_countries ?? undefined;
    this.language_tags = e.language_tags ?? undefined;
    this.tags = e.tags ?? undefined;
    this.onion_address = e.onion_address ?? undefined;

    // Optional fields
    this.posting_policy = e.posting_policy ?? undefined;
    this.payments_url = e.payments_url ?? undefined;
    this.icon = e.icon ?? undefined;
    this.url = e.url ?? undefined;

    // Handle Retention
    if (e.retention) {
      this.retention = e.retention ?? undefined;
    }

    // Handle Fees
    this.fees =
      e.fees && (e.fees.admission ?? e.fees.publication ?? e.fees.subscription)
        ? {
            admission: e.fees.admission?.map((a) => ({
              amount: a.amount,
              unit: a.unit,
            })),
            publication: e.fees.publication?.map((p) => ({
              amount: p.amount,
              kinds: p.kinds,
              unit: p.unit,
            })),
            subscription: e.fees.subscription?.map((s) => ({
              amount: s.amount,
              period: s.period,
              unit: s.unit,
            })),
          }
        : undefined;

    // Handle Limitation
    this.limitation = e.limitation
      ? {
          auth_required: e.limitation.auth_required ?? undefined,
          max_message_length: e.limitation.max_message_length ?? undefined,
          max_subid_length: e.limitation.max_subid_length ?? undefined,
          max_subscriptions: e.limitation.max_subscriptions ?? undefined,
          min_pow_difficulty: e.limitation.min_pow_difficulty ?? undefined,
          payment_required: e.limitation.payment_required ?? undefined,
          restricted_writes: e.limitation.restricted_writes ?? undefined,
          max_event_tags: e.limitation.max_event_tags ?? undefined,
          max_content_length: e.limitation.max_content_length ?? undefined,
          created_at_lower_limit: e.limitation.created_at_lower_limit ?? undefined,
          created_at_upper_limit: e.limitation.created_at_upper_limit ?? undefined,
          default_limit: e.limitation.default_query_limit ?? undefined,
          max_limit: e.limitation.max_limit ?? undefined,
        }
      : undefined;
  }
}
