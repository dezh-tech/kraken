import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { Nip11DTO } from '../dto/nip11.dto';
import { FeesEntity } from './fees.entity';
import { RetentionEntity } from './retention.entity';
import { LimitationEntity } from './limitaion.entity';

@Entity('config')
export class Nip11Entity extends AbstractEntity<Nip11DTO> {
  dtoClass = Nip11DTO;

  @Column()
  name: string | null;

  @Column()
  description: string | null;

  @Column()
  pubkey: string | null;

  @Column()
  banner: string | null;

  @Column()
  contact: string | null;

  @Column()
  software: string | null;

  @Column()
  supported_nips: number[] | null;

  @Column()
  version: string | null;

  @Column()
  relay_countries: string[] | null;

  @Column()
  language_tags: string[] | null;

  @Column()
  tags: string[] | null;

  @Column()
  posting_policy: string | null;

  @Column()
  payments_url: string | null;

  @Column()
  icon: string | null;

  @Column()
  url: string | null;

  @Column()
  retention?: RetentionEntity[] | null;

  @Column()
  fees?: FeesEntity | null;

  @Column()
  limitations?: LimitationEntity | null;

  constructor(item?: Partial<Omit<Nip11Entity, 'id'>>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  assign(item: Partial<Omit<Nip11Entity, 'id'>>): void {
    super.assign(item);

    this.name = item.name ?? this.name;
    this.description = item.description ?? this.description;

    this.pubkey = item.pubkey ?? this.pubkey;
    this.banner = item.banner ?? this.banner;
    this.contact = item.contact ?? this.contact;
    this.software = item.software ?? this.software;
    this.supported_nips = item.supported_nips ?? this.supported_nips;
    this.version = item.version ?? this.version;
    this.relay_countries = item.relay_countries ?? this.relay_countries;
    this.language_tags = item.language_tags ?? this.language_tags;
    this.tags = item.tags ?? this.tags;
    this.posting_policy = item.posting_policy ?? this.posting_policy;
    this.payments_url = item.payments_url ?? this.payments_url;
    this.icon = item.icon ?? this.icon;
    this.url = item.url ?? this.url;

    // Handle Retention
    this.retention = item.retention ?? this.retention ?? null;

    // Handle Fees
    this.fees = item.fees ?? this.fees ?? null;

    // Handle Limitations
    this.limitations = {
      max_message_length: item.limitations?.max_message_length ?? this.limitations?.max_message_length ?? null,
      max_subscriptions: item.limitations?.max_subscriptions ?? this.limitations?.max_subscriptions ?? null,
      max_filters: item.limitations?.max_filters ?? this.limitations?.max_filters ?? null,
      max_subid_length: item.limitations?.max_subid_length ?? this.limitations?.max_subid_length ?? null,
      min_pow_difficulty: item.limitations?.min_pow_difficulty ?? this.limitations?.min_pow_difficulty ?? null,
      auth_required: item.limitations?.auth_required ?? this.limitations?.auth_required ?? null,
      payment_required: item.limitations?.payment_required ?? this.limitations?.payment_required ?? null,
      restricted_writes: item.limitations?.restricted_writes ?? this.limitations?.restricted_writes ?? null,
      max_event_tags: item.limitations?.max_event_tags ?? this.limitations?.max_event_tags ?? null,
      max_content_length: item.limitations?.max_content_length ?? this.limitations?.max_content_length ?? null,
      created_at_lower_limit:
        item.limitations?.created_at_lower_limit ?? this.limitations?.created_at_lower_limit ?? null,
      created_at_upper_limit:
        item.limitations?.created_at_upper_limit ?? this.limitations?.created_at_upper_limit ?? null,
      max_limit: item.limitations?.max_limit ?? this.limitations?.max_limit ?? null,
      default_query_limit: item.limitations?.default_query_limit ?? this.limitations?.default_query_limit ?? null,
    };
  }
}
