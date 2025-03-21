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
  onion_address: string | null;

  @Column()
  retention?: RetentionEntity[] | null;

  @Column()
  fees?: FeesEntity | null;

  @Column()
  limitation?: LimitationEntity | null;

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
    this.onion_address = item.onion_address ?? this.onion_address;

    // Handle Retention
    this.retention = item.retention ?? this.retention ?? null;

    // Handle Fees
    this.fees = item.fees ?? this.fees ?? null;

    // Handle Limitation
    this.limitation = {
      max_message_length: item.limitation?.max_message_length ?? this.limitation?.max_message_length ?? null,
      max_subscriptions: item.limitation?.max_subscriptions ?? this.limitation?.max_subscriptions ?? null,
      max_subid_length: item.limitation?.max_subid_length ?? this.limitation?.max_subid_length ?? null,
      min_pow_difficulty: item.limitation?.min_pow_difficulty ?? this.limitation?.min_pow_difficulty ?? null,
      auth_required: item.limitation?.auth_required ?? this.limitation?.auth_required ?? null,
      payment_required: item.limitation?.payment_required ?? this.limitation?.payment_required ?? null,
      restricted_writes: item.limitation?.restricted_writes ?? this.limitation?.restricted_writes ?? null,
      max_event_tags: item.limitation?.max_event_tags ?? this.limitation?.max_event_tags ?? null,
      max_content_length: item.limitation?.max_content_length ?? this.limitation?.max_content_length ?? null,
      created_at_lower_limit:
        item.limitation?.created_at_lower_limit ?? this.limitation?.created_at_lower_limit ?? null,
      created_at_upper_limit:
        item.limitation?.created_at_upper_limit ?? this.limitation?.created_at_upper_limit ?? null,
      max_limit: item.limitation?.max_limit ?? this.limitation?.max_limit ?? null,
      default_query_limit: item.limitation?.default_query_limit ?? this.limitation?.default_query_limit ?? null,
    };
  }
}
