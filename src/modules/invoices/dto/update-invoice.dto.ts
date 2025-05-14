import { PartialType } from '@nestjs/swagger';

import { CreateInvoice } from './create-invoice.dto';

export class UpdateInvoice extends PartialType(CreateInvoice) {}
