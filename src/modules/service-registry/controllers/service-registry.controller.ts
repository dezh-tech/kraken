import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type RegisterServiceRegistryDto from '../dtos/service-registry-register.dto';
import ServiceRegistryService from '../services/service-registry.service';

@Controller('service-registry')
@ApiTags('service-registry')
export default class ServiceRegistryController {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  @Get()
  async getServices() {
    const services = await this.serviceRegistryService.findAll();

    return services.toDtos();
  }

  async registerService(props: RegisterServiceRegistryDto) {
    await this.serviceRegistryService.register(props);
  }
}
