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
  contact: string;

  @Column({ type: 'varchar' })
  software: string;

  @Column('simple-array')
  supportedNips: number[];

  @Column({ type: 'varchar' })
  version: string;

  @Column('simple-array')
  relayCountries: string[];

  @Column('simple-array')
  languageTags: string[];

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  postingPolicy: string;

  @Column({ type: 'varchar', nullable: true })
  paymentsUrl: string;

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
    this.contact = item.contact ?? this.contact;
    this.software = item.software ?? this.software;
    this.supportedNips = item.supportedNips ?? this.supportedNips;
    this.version = item.version ?? this.version;
    this.relayCountries = item.relayCountries ?? this.relayCountries;
    this.languageTags = item.languageTags ?? this.languageTags;
    this.tags = item.tags ?? this.tags;
    this.postingPolicy = item.postingPolicy ?? this.postingPolicy;
    this.paymentsUrl = item.paymentsUrl ?? this.paymentsUrl;
    this.icon = item.icon ?? this.icon;
    this.url = item.url ?? this.url;

    // Handle Retention
    this.retention = {
      ...this.retention,
      ...(item.retention ?? {}),
      time: item.retention?.time ?? this.retention?.time,
      count: item.retention?.count ?? this.retention?.count,
      kinds: item.retention?.kinds ?? this.retention?.kinds,
    };

    // Handle Fees
    this.fees = {
      ...this.fees,
      ...(item.fees ?? {}),
      subscription: item.fees?.subscription ?? this.fees?.subscription,
      publication: item.fees?.publication ?? this.fees?.publication,
      admission: item.fees?.admission ?? this.fees?.admission,
    };

    // Handle Limitations
    this.limitations = {
      ...this.limitations,
      ...(item.limitations ?? {}),
      maxMessageLength: item.limitations?.maxMessageLength ?? this.limitations?.maxMessageLength,
      maxSubscriptions: item.limitations?.maxSubscriptions ?? this.limitations?.maxSubscriptions,
      maxFilters: item.limitations?.maxFilters ?? this.limitations?.maxFilters,
      maxSubidLength: item.limitations?.maxSubidLength ?? this.limitations?.maxSubidLength,
      minPowDifficulty: item.limitations?.minPowDifficulty ?? this.limitations?.minPowDifficulty,
      authRequired: item.limitations?.authRequired ?? this.limitations?.authRequired,
      paymentRequired: item.limitations?.paymentRequired ?? this.limitations?.paymentRequired,
      restrictedWrites: item.limitations?.restrictedWrites ?? this.limitations?.restrictedWrites,
      maxEventTags: item.limitations?.maxEventTags ?? this.limitations?.maxEventTags,
      maxContentLength: item.limitations?.maxContentLength ?? this.limitations?.maxContentLength,
      createdAtLowerLimit: item.limitations?.createdAtLowerLimit ?? this.limitations?.createdAtLowerLimit,
      createdAtUpperLimit: item.limitations?.createdAtUpperLimit ?? this.limitations?.createdAtUpperLimit,
      maxQueryLimit: item.limitations?.maxQueryLimit ?? this.limitations?.maxQueryLimit,
      defaultQueryLimit: item.limitations?.defaultQueryLimit ?? this.limitations?.defaultQueryLimit,
    };
  }

}
