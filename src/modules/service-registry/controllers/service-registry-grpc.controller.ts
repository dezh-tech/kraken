import { Controller } from '@nestjs/common';

import type { registerServiceRequest, registerServiceResponse } from '../../grpc/gen/ts/kraken';
import { KrakenServiceRegistryServiceControllerMethods, ServiceTypeEnum } from '../../grpc/gen/ts/kraken';
import { ServiceType } from '../enums/service-types.enum';
import ServiceRegistryService from '../services/service-registry.service';

@KrakenServiceRegistryServiceControllerMethods()
@Controller()
export class ServiceRegistryGrpcController {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  async registerService({
    heartbeatDurationInSec,
    type,
    url,
  }: registerServiceRequest): Promise<registerServiceResponse> {
    try {
      await this.serviceRegistryService.register({
        heartbeatDurationInSec,
        url,
        type: ServiceType[ServiceTypeEnum[type] as keyof typeof ServiceType],
      });
    } catch (error) {
      return {
        success: false,
        message: JSON.stringify(error),
      };
    }

    return {
      success: true,
      message: '',
    };
  }
}
