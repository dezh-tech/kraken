import type { ServerUnaryCall } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';

import { ApiConfigService } from '../../../../src/shared/services/api-config.service';
import type { registerServiceRequest, registerServiceResponse } from '../../grpc/gen/ts/kraken';
import { KrakenServiceRegistryServiceControllerMethods, ServiceTypeEnum } from '../../grpc/gen/ts/kraken';
import { ServiceType } from '../enums/service-types.enum';
import ServiceRegistryService from '../services/service-registry.service';

@Controller()
@KrakenServiceRegistryServiceControllerMethods()
export class ServiceRegistryGrpcController {
  constructor(
    private readonly serviceRegistryService: ServiceRegistryService,
    private readonly apiConfig: ApiConfigService,
  ) {}

  async registerService(
    { heartbeatDurationInSec, type, url, region }: registerServiceRequest,
    metadata?: Metadata,
    call?: ServerUnaryCall<unknown, unknown>,
  ): Promise<registerServiceResponse> {
    try {
      const token = metadata?.getMap().token?.toString();

      if (!token) {
        throw new Error('Missing authentication token in metadata.');
      }

      const isValidServiceAuthToken = this.serviceRegistryService.isValidServiceAuthToken(token);

      if (!isValidServiceAuthToken) {
        throw new Error('Invalid authentication token.');
      }

      const serviceTypeKey = ServiceTypeEnum[type];

      if (!serviceTypeKey || !(serviceTypeKey in ServiceType)) {
        throw new Error(`Invalid service type: ${type}`);
      }

      const { token: newToken } = await this.serviceRegistryService.register({
        heartbeatDurationInSec,
        url,
        type: ServiceType[serviceTypeKey as keyof typeof ServiceType],
        region,
      });

      const responseMetadata = new Metadata();
      responseMetadata.add('token', newToken);

      if (call) {
        call.sendMetadata(responseMetadata);
      }

      return {
        success: true,
      };
    } catch (error) {
      const err = error as { message: string; stack: string };

      return {
        success: false,
        message: err.message || 'An unknown error occurred.',
        ...(this.apiConfig.isDevelopment && { details: err.stack }),
      };
    }
  }
}
