import { Column } from 'typeorm';

export class LimitationEntity {
  @Column({ type: 'int' })
  maxMessageLength?: number;

  @Column({ type: 'int' })
  maxSubscriptions?: number;

  @Column({ type: 'int' })
  maxFilters?: number;

  @Column({ type: 'int' })
  maxSubidLength?: number;

  @Column({ type: 'int' })
  minPowDifficulty?: number;

  @Column({ type: 'boolean' })
  authRequired?: boolean;

  @Column({ type: 'boolean' })
  paymentRequired?: boolean;

  @Column({ type: 'boolean' })
  restrictedWrites?: boolean;

  @Column({ type: 'int' })
  maxEventTags?: number;

  @Column({ type: 'int' })
  maxContentLength?: number;

  @Column({ type: 'bigint' })
  createdAtLowerLimit?: number;

  @Column({ type: 'bigint' })
  createdAtUpperLimit?: number;

  @Column({ type: 'int' })
  maxQueryLimit?: number;

  @Column({ type: 'int' })
  defaultQueryLimit?: number;
}
