import { Controller, UseInterceptors } from '@nestjs/common';

import type { ConfigController, EmptyRequest, getConfigResponse } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigControllerMethods } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigService } from '../config.service';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInvalidArgumentException, GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';

@Controller()
@ConfigControllerMethods()
@UseInterceptors(GrpcToHttpInterceptor)
export class ConfigGrpcController implements ConfigController {
  constructor(private readonly configService: ConfigService) {}

  async getConfig(_request: EmptyRequest, _metadata?: Metadata): Promise<getConfigResponse> {
    const token = _metadata?.get('x-identifier')?.[0] as string | undefined;
    if (!token) {
      throw new GrpcInvalidArgumentException("input 'x-identifier' is not valid.");
    }
    const config = await this.configService.getNip11();

    return config?.toDto() as getConfigResponse;
  }
}
