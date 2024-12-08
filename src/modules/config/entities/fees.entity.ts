import { Column } from 'typeorm';

export class SubscriptionEntity {
  @Column()
  amount: number;

  @Column()
  unit: string;

  @Column()
  period: number;
}

export class PublicationEntity {
  @Column()
  kinds: number[];

  @Column()
  amount: number;

  @Column()
  unit: string;
}

export class AdmissionEntity {
  @Column()
  amount: number;

  @Column()
  unit: string;
}

export class FeesEntity {
  @Column({ nullable: true })
  subscription?: SubscriptionEntity[];

  @Column({ nullable: true })
  publication?: PublicationEntity[];

  @Column({ nullable: true })
  admission?: AdmissionEntity[];
}