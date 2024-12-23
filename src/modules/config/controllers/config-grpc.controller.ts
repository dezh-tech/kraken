import { Controller, UseInterceptors } from '@nestjs/common';

import type { ConfigController, EmptyRequest, getConfigResponse } from '../../../../src/modules/grpc/gen/ts/kraken';
import { ConfigControllerMethods } from '../../../../src/modules/grpc/gen/ts/kraken';
import { GrpcInvalidArgumentException, GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';
import { ConfigService } from '../config.service';
import { Metadata } from '@grpc/grpc-js';

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
    const { url, limitations } = await this.configService.getNip11();

    return {
      url,
      limitations: {
        maxMessageLength: limitations?.max_message_length,
        maxSubscriptions: limitations?.max_subscriptions,
        maxFilters: limitations?.max_filters,
        maxSubidLength: limitations?.max_subid_length,
        minPowDifficulty: limitations?.min_pow_difficulty,
        authRequired: limitations?.auth_required,
        paymentRequired: limitations?.payment_required,
        restrictedWrites: limitations?.restricted_writes,
        maxEventTags: limitations?.max_event_tags,
        maxContentLength: limitations?.max_content_length,
        createdAtLowerLimit: limitations?.created_at_lower_limit,
        createdAtUpperLimit: limitations?.created_at_upper_limit,
        defaultQueryLimit: limitations?.default_query_limit,
        maxQueryLimit: limitations?.max_limit,
      },
    } as getConfigResponse;
  }
}
