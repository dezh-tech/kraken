import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../src/common/abstract.entity';
import { SubscriptionDto } from '../dto/subscription.dto';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Entity('subscriptions')
export class SubscriptionEntity extends AbstractEntity<SubscriptionDto> {
  dtoClass = SubscriptionDto;

  @Column('string')
  checkoutSessionId: string;

  @Column('string')
  subscriber: string;

  @Column('timestamp')
  startDate: number;

  @Column('timestamp')
  endDate: number;

  @Column({ enum: SubscriptionStatus, type: 'enum', default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Column('number')
  totalAmount: number;

  @Column('string')
  unit: string;

  constructor(item?: Partial<Omit<SubscriptionEntity, 'id'>>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<Omit<SubscriptionEntity, 'id'>>): void {
    this.checkoutSessionId = item.checkoutSessionId ?? this.checkoutSessionId;
    this.subscriber = item.subscriber ?? this.subscriber;
    this.startDate = item.startDate ?? this.startDate;
    this.endDate = item.endDate ?? this.endDate;
    this.status = item.status ?? this.status;
    this.totalAmount = item.totalAmount ?? this.totalAmount;
    this.unit = item.unit ?? this.unit;
  }
}
