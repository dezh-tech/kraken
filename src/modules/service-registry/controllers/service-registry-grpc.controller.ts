import type { ServerUnaryCall } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';

import { ApiConfigService } from '../../../../src/shared/services/api-config.service';
import type { registerServiceRequest, registerServiceResponse } from '../../grpc/gen/ts/kraken';
import { ServiceRegistryControllerMethods, ServiceTypeEnum } from '../../grpc/gen/ts/kraken';
import { ServiceType } from '../enums/service-types.enum';
import ServiceRegistryService from '../services/service-registry.service';

@Controller()
@ServiceRegistryControllerMethods()
export class ServiceRegistryGrpcController implements ServiceRegistryGrpcController {
  constructor(
    private readonly serviceRegistryService: ServiceRegistryService,
    private readonly apiConfig: ApiConfigService,
  ) {}

  async registerService({
    heartbeatDurationInSec,
    type,
    url,
    region,
  }: registerServiceRequest): Promise<registerServiceResponse> {
    try {
      const serviceTypeKey = ServiceTypeEnum[type];

      if (!serviceTypeKey || !(serviceTypeKey in ServiceType)) {
        throw new Error(`Invalid service type: ${type}`);
      }

      const { token } = await this.serviceRegistryService.register({
        heartbeatDurationInSec,
        url,
        type: ServiceType[serviceTypeKey as keyof typeof ServiceType],
        region,
      });

      return {
        success: true,
        token: token,
      };
    } catch (error) {
      const err = error as { message: string; stack: string };

      return {
        success: false,
        message: err.message || 'An unknown error occurred.',
        ...(this.apiConfig.isDevelopment && { details: err.stack }),
        token: '',
      };
    }
  }
}
