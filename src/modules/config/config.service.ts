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

    if (!config) {
      config = this.configRepo.create(props);
    }

    config.assign(props);

    return this.configRepo.save(config);
  }
}
