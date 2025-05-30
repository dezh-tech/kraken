import type { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';

import type { AddLogRequest, AddLogResponse, LogController } from '../../../../src/modules/grpc/gen/ts/log';
import { LogControllerMethods } from '../../../../src/modules/grpc/gen/ts/log';
import ServiceRegistryService from '../../../../src/modules/service-registry/services/service-registry.service';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { LogService } from '../log.service';

@Controller()
@LogControllerMethods()
export class LogGrpcController implements LogController {
  constructor(
    private readonly logService: LogService,
    private readonly apiConfig: ApiConfigService,
    private readonly serviceRegistryService: ServiceRegistryService,
  ) {}

  async addLog(request: AddLogRequest, metadata?: Metadata): Promise<AddLogResponse> {
    try {
      const token = metadata?.getMap().token?.toString();

      if (!token) {
        throw new Error('Missing authentication token in metadata.');
      }

      const service = await this.serviceRegistryService.findByToken(token);

      if (!service) {
        throw new Error('Invalid authentication token.');
      }

      await this.logService.addLog({
        message: request.message,
        stack: request.stack,
        serviceId: service._id.toString(),
      });

      return {
        success: true,
        message: '',
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
