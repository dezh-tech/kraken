import { Injectable } from '@nestjs/common';

import { ConfigRepository } from './config.repository';
import type { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {
  constructor(private readonly configRepo: ConfigRepository) {}

  async getConfig() {
    return this.configRepo.findOne();
  }

  async update(props: UpdateConfigDto) {
    let config = await this.getConfig();
    console.log('AAAAA');
    if (!config) {
      config = this.configRepo.create(props);
    }

    console.log('BBBBBBB');


    config.assign(props);
    console.log('CCCCCC');


    return this.configRepo.save(config);
  }
}
