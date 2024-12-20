import { Column } from 'typeorm';

export class LimitationEntity {
  @Column({ type: 'int' })
  max_message_length?: number;

  @Column({ type: 'int' })
  max_subscriptions?: number;

  @Column({ type: 'int' })
  max_filters?: number;

  @Column({ type: 'int' })
  max_subid_length?: number;

  @Column({ type: 'int' })
  min_pow_difficulty?: number;

  @Column({ type: 'boolean' })
  auth_required?: boolean;

  @Column({ type: 'boolean' })
  payment_required?: boolean;

  @Column({ type: 'boolean' })
  restricted_writes?: boolean;

  @Column({ type: 'int' })
  max_event_tags?: number;

  @Column({ type: 'int' })
  max_content_length?: number;

  @Column({ type: 'bigint' })
  created_at_lower_limit?: number;

  @Column({ type: 'bigint' })
  created_at_upper_limit?: number;

  @Column({ type: 'int' })
  max_limit?: number;

  @Column({ type: 'int' })
  default_query_limit?: number;
}
