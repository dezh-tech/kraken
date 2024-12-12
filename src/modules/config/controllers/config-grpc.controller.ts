import { Controller } from '@nestjs/common';

import type { getConfigResponse } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigControllerMethods } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigService } from '../config.service';

@Controller()
@ConfigControllerMethods()
export class ConfigGrpcController implements ConfigGrpcController {
  constructor(private readonly configService: ConfigService) {}

  async getConfig(): Promise<getConfigResponse> {
    const config = await this.configService.getConfig();

    return config?.toDto() as getConfigResponse;
  }
}
