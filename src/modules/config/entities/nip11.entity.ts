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
    this.retention = item.retention ?? this.retention;
    this.fees = item.fees ?? this.fees;
    this.limitations = item.limitations ?? this.limitations;
  }
}
