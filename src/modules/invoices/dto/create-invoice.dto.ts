import { PickType } from '@nestjs/swagger';

import { InvoiceDto } from './invoice.dto';

export class CreateInvoice extends PickType(InvoiceDto, [
  'checkoutSessionId',
  'status',
  'subscriptionId',
  'totalAmount',
  'unit',
] as const) {}
