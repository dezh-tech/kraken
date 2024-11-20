import { Controller, Get } from '@nestjs/common';

import ServiceRegistryService from '../services/service-registry.service';

@Controller('service-registry')
export default class ServiceRegistryController {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  @Get()
  async getServices() {
    const services = await this.serviceRegistryService.findAll();

    return services.map((s) => s.toDto());
  }
}
