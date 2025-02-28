import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../src/common/abstract.entity';
import { SubscriptionDto } from '../dto/subscription.dto';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';

@Entity('subscriptions')
export class SubscriptionEntity extends AbstractEntity<SubscriptionDto> {
  dtoClass = SubscriptionDto;

  @Column()
  subscriber: string;

  @Column()
  startDate: number;

  @Column()
  endDate: number;

  @Column({ enum: SubscriptionStatusEnum, type: 'enum', default: SubscriptionStatusEnum.ACTIVE })
  status: SubscriptionStatusEnum;

  constructor(item?: Partial<Omit<SubscriptionEntity, 'id'>>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<Omit<SubscriptionEntity, 'id'>>): void {
    this.subscriber = item.subscriber ?? this.subscriber;
    this.startDate = item.startDate ?? this.startDate;
    this.endDate = item.endDate ?? this.endDate;
    this.status = item.status ?? this.status;
  }
}
