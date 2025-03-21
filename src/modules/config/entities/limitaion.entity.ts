import { Column } from 'typeorm';

export class LimitationEntity {
  @Column()
  max_message_length?: number | null;

  @Column()
  max_subscriptions?: number | null;

  @Column()
  max_subid_length?: number | null;

  @Column()
  min_pow_difficulty?: number | null;

  @Column()
  auth_required?: boolean | null;

  @Column()
  payment_required?: boolean | null;

  @Column()
  restricted_writes?: boolean | null;

  @Column()
  max_event_tags?: number | null;

  @Column()
  max_content_length?: number | null;

  @Column()
  created_at_lower_limit?: number | null;

  @Column()
  created_at_upper_limit?: number | null;

  @Column()
  max_limit?: number | null;

  @Column()
  default_query_limit?: number | null;
}
