import { Controller, UseInterceptors } from '@nestjs/common';

import { GrpcInvalidArgumentException, GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';
import { ConfigService } from '../config.service';
import { Metadata } from '@grpc/grpc-js';
import { GetParametersRequest, GetParametersResponse, ParametersController, ParametersControllerMethods } from '../../../../src/modules/grpc/gen/ts/config';

@Controller()
@ParametersControllerMethods()
@UseInterceptors(GrpcToHttpInterceptor)
export class ConfigGrpcController implements ParametersController {
  constructor(private readonly configService: ConfigService) {}

  async getParameters(_request: GetParametersRequest, _metadata?: Metadata): Promise<GetParametersResponse> {
    const token = _metadata?.get('x-identifier')?.[0] as string | undefined;
    if (!token) {
      throw new GrpcInvalidArgumentException("input 'x-identifier' is not valid.");
    }
    const { url, limitation: limitations } = await this.configService.getNip11();

    return {
      url,
      limitations: {
        maxMessageLength: limitations?.max_message_length,
        maxSubscriptions: limitations?.max_subscriptions,
        maxFilters: 0, // TODO ::: remove me.
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
    } as GetParametersResponse;
  }
}
