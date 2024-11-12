import { Controller } from '@nestjs/common';
import type {
  KrakenServiceController,
  registerServiceRequest,
  registerServiceResponse,
} from 'src/modules/grpc/gen/ts/kraken';
import { KrakenServiceControllerMethods, ServiceTypeEnum } from 'src/modules/grpc/gen/ts/kraken';

import { ServiceType } from '../enums/service-types.enum';
import ServiceRegistryService from '../service-registry.service';

@KrakenServiceControllerMethods()
@Controller()
export default class ServiceRegistryController implements Partial<KrakenServiceController> {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  async registerService({
    heartbeatDurationInSec,
    type,
    url,
  }: registerServiceRequest): Promise<registerServiceResponse> {
    try {
      await this.serviceRegistryService.register({
        heartbeat_duration_in_sec: heartbeatDurationInSec,
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
    };
  }
}
