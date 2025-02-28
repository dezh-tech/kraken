import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../src/common/abstract.entity';
import { InvoiceStatusEnum } from '../enums/invoice-status.enum';
import { InvoiceDto } from '../dto/invoice.dto';

@Entity('invoices')
export class InvoiceEntity extends AbstractEntity<InvoiceDto> {
  dtoClass = InvoiceDto;

  @Column('string')
  checkoutSessionId: string;

  @Column('string')
  subscriptionId: string;

  @Column({ enum: InvoiceStatusEnum, type: 'enum', default: InvoiceStatusEnum.CREATED })
  status: InvoiceStatusEnum;

  @Column('number')
  totalAmount: number;

  @Column('string')
  unit: string;

  constructor(item?: Partial<Omit<InvoiceEntity, 'id'>>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<Omit<InvoiceEntity, 'id'>>): void {
    this.checkoutSessionId = item.checkoutSessionId ?? this.checkoutSessionId;
    this.subscriptionId = item.subscriptionId ?? this.subscriptionId;
    this.status = item.status ?? this.status;
    this.totalAmount = item.totalAmount ?? this.totalAmount;
    this.unit = item.unit ?? this.unit;
  }
}
