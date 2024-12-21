import type { ServerUnaryCall, Metadata } from '@grpc/grpc-js';
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

  async registerService(
    request: registerServiceRequest,
    _metadata: Metadata,
    call: ServerUnaryCall<registerServiceRequest, registerServiceResponse>,
  ): Promise<registerServiceResponse> {
    try {
      const { port, heartbeatDurationInSec, type, region } = request;

      const serviceTypeKey = ServiceTypeEnum[type];

      if (!serviceTypeKey || !(serviceTypeKey in ServiceType)) {
        throw new Error(`Invalid service type: ${type}`);
      }

      const callerIp = call.getPeer().split(':')[0] + ':' + port;

      const { token } = await this.serviceRegistryService.register({
        heartbeatDurationInSec,
        url: callerIp,
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
