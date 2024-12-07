import type { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';

import type { registerServiceRequest, registerServiceResponse } from '../../grpc/gen/ts/kraken';
import { KrakenServiceRegistryServiceControllerMethods, ServiceTypeEnum } from '../../grpc/gen/ts/kraken';
import { ServiceType } from '../enums/service-types.enum';
import ServiceRegistryService from '../services/service-registry.service';

@Controller()
@KrakenServiceRegistryServiceControllerMethods()
export class ServiceRegistryGrpcController {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  async registerService(
    { heartbeatDurationInSec, type, url }: registerServiceRequest,
    metadata?: Metadata,
  ): Promise<registerServiceResponse> {
    try {
      const isValidServiceAuthToken = this.serviceRegistryService.isValidServiceAuthToken(
        metadata?.getMap().token?.toString() ?? '',
      );

      if (!isValidServiceAuthToken) {
        throw new Error('invalid auth token.');
      }

      const { token } = await this.serviceRegistryService.register({
        heartbeatDurationInSec,
        url,
        type: ServiceType[ServiceTypeEnum[type] as keyof typeof ServiceType],
      });

      return {
        success: true,
        message: '',
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: JSON.stringify(error.message),
      };
    }
  }
}
