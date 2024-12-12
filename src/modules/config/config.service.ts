import { Injectable } from '@nestjs/common';

import { ConfigRepository } from './config.repository';
import type { UpdateConfigDto } from './dto/update-config.dto';
import { EventEmitter } from 'node:stream';

@Injectable()
export class ConfigService extends EventEmitter {
  constructor(private readonly configRepo: ConfigRepository) {
    super();
  }

  async getConfig() {
    return this.configRepo.findOne();
  }

  async update(props: UpdateConfigDto) {
    let config = await this.getConfig();

    if (!config) {
      config = this.configRepo.create(props);
    }

    config.assign(props);

    const res = await this.configRepo.save(config);

    this.emit('CONFIG-UPDATED', res);

    return res;
  }
}
