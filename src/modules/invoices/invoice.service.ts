import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { CreateInvoice } from './dto/create-invoice.dto';
import { UpdateInvoice } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly repo: InvoiceRepository) {}

  async create(prop: CreateInvoice) {
    const inv = this.repo.create(prop);
    return this.repo.save(inv);
  }

  async updateByCheckoutSessionId(id: string, prop: UpdateInvoice) {
    const inv = await this.repo.findOne({
      where: {
        checkoutSessionId: id,
      },
    });

    if (!inv) {
      throw new NotFoundException('invoice not found');
    }

    inv.assign(prop);

    return this.repo.save(inv);
  }
}
