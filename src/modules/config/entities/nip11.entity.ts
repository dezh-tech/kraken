import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { Nip11DTO } from '../dto/nip11.dto';
import { FeesEntity } from './fees.entity';
import { RetentionEntity } from './retention.entity';
import { LimitationEntity } from './limitaion.entity';

@Entity('config')
export class Nip11Entity extends AbstractEntity<Nip11DTO> {
  dtoClass = Nip11DTO;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  pubkey: string;

  @Column({ type: 'varchar' })
  banner: string;

  @Column({ type: 'varchar' })
  contact: string;

  @Column({ type: 'varchar' })
  software: string;

  @Column('simple-array')
  supported_nips: number[];

  @Column({ type: 'varchar' })
  version: string;

  @Column('simple-array')
  relay_countries: string[];

  @Column('simple-array')
  language_tags: string[];

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  posting_policy: string;

  @Column({ type: 'varchar', nullable: true })
  payments_url: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @Column({ type: 'varchar', nullable: true })
  url: string;

  @Column({ type: 'json', nullable: true })
  retention?: RetentionEntity;

  @Column({ type: 'json', nullable: true })
  fees?: FeesEntity;

  @Column({ type: 'json', nullable: true })
  limitations?: LimitationEntity;

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
    this.retention = {
      time: item.retention?.time ?? this.retention?.time,
      count: item.retention?.count ?? this.retention?.count,
      kinds: item.retention?.kinds ?? this.retention?.kinds,
    };

    // Handle Fees
    this.fees = {
      subscription: item.fees?.subscription ?? this.fees?.subscription,
      publication: item.fees?.publication ?? this.fees?.publication,
      admission: item.fees?.admission ?? this.fees?.admission,
    };

    // Handle Limitations
    this.limitations = {
      max_message_length: item.limitations?.max_message_length ?? this.limitations?.max_message_length,
      max_subscriptions: item.limitations?.max_subscriptions ?? this.limitations?.max_subscriptions,
      max_filters: item.limitations?.max_filters ?? this.limitations?.max_filters,
      max_subid_length: item.limitations?.max_subid_length ?? this.limitations?.max_subid_length,
      min_pow_difficulty: item.limitations?.min_pow_difficulty ?? this.limitations?.min_pow_difficulty,
      auth_required: item.limitations?.auth_required ?? this.limitations?.auth_required,
      payment_required: item.limitations?.payment_required ?? this.limitations?.payment_required,
      restricted_writes: item.limitations?.restricted_writes ?? this.limitations?.restricted_writes,
      max_event_tags: item.limitations?.max_event_tags ?? this.limitations?.max_event_tags,
      max_content_length: item.limitations?.max_content_length ?? this.limitations?.max_content_length,
      created_at_lower_limit: item.limitations?.created_at_lower_limit ?? this.limitations?.created_at_lower_limit,
      created_at_upper_limit: item.limitations?.created_at_upper_limit ?? this.limitations?.created_at_upper_limit,
      max_limit: item.limitations?.max_limit ?? this.limitations?.max_limit,
      default_query_limit: item.limitations?.default_query_limit ?? this.limitations?.default_query_limit,
    };
  }
}
