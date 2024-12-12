import { Injectable } from '@nestjs/common';

import { Nip11Repository } from './repositories/nip11.repository';
import type { UpdateNip11Dto } from './dto/update-config.dto';
import { EventEmitter } from 'node:stream';

@Injectable()
export class ConfigService extends EventEmitter {
  constructor(
    private readonly nip11Repo: Nip11Repository,
  ) {
    super();
  }

  async getNip11() {
    return this.nip11Repo.findOne();
  }

  async updateNip11(props: UpdateNip11Dto) {
    let config = await this.getNip11();

    if (!config) {
      config = this.nip11Repo.create(props);
    }

    config.assign(props);

    const res = await this.nip11Repo.save(config);

    this.emit('NIP11-UPDATED', res);

    return res;
  }
}
