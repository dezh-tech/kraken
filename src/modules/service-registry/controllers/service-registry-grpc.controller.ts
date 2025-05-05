import type { ServerUnaryCall, Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';

import { ApiConfigService } from '../../../../src/shared/services/api-config.service';
import { ServiceType } from '../enums/service-types.enum';
import ServiceRegistryService from '../services/service-registry.service';
import {
  RegisterServiceRequest,
  RegisterServiceResponse,
  ServiceRegistryControllerMethods,
  ServiceTypeEnum,
} from '../../../../src/modules/grpc/gen/ts/service_registry';

@Controller()
@ServiceRegistryControllerMethods()
export class ServiceRegistryGrpcController implements ServiceRegistryGrpcController {
  constructor(
    private readonly serviceRegistryService: ServiceRegistryService,
    private readonly apiConfig: ApiConfigService,
  ) {}

  async registerService(
    request: RegisterServiceRequest,
    _metadata: Metadata,
  ): Promise<RegisterServiceResponse> {
    try {
      const { url, port, heartbeatDurationInSec, type, region } = request;

      const serviceTypeKey = ServiceTypeEnum[type];

      if (!serviceTypeKey || !(serviceTypeKey in ServiceType)) {
        throw new Error(`Invalid service type: ${type}`);
      }

      const callerIp = url + ':' + port;

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
