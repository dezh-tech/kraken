import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import type RegisterServiceRegistryDto from '../dtos/service-registry-register.dto';
import ServiceRegistryService from '../services/service-registry.service';
import JwtAuthGuard from '../../../../src/modules/auth/guards/jwt-auth.guard';

@Controller('service-registry')
@ApiTags('service-registry')
export default class ServiceRegistryController {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getServices() {
    const services = await this.serviceRegistryService.findAll();

    return services.toDtos();
  }

  async registerService(props: RegisterServiceRegistryDto) {
    await this.serviceRegistryService.register(props);
  }
}
