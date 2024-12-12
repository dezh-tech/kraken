import { Controller } from '@nestjs/common';

import type { ConfigController, EmptyRequest, getConfigResponse } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigControllerMethods } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigService } from '../config.service';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

@Controller()
@ConfigControllerMethods()
export class ConfigGrpcController implements ConfigController {
  constructor(private readonly configService: ConfigService) {}

  async getConfig(_request: EmptyRequest, _metadata?: Metadata): Promise<getConfigResponse> {
    const config = await this.configService.getNip11();

    return config?.toDto() as getConfigResponse;
  }
}
