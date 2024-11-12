import { Controller, Get } from '@nestjs/common';
import ServiceRegistryService from '../service-registry.service';
import { ServiceRegistryDto } from '../dtos/service-registry.dto';

@Controller('service-registry')
export default class ServiceRegistryController {
  constructor(private readonly serviceRegistryService: ServiceRegistryService) {}

  @Get()
  async getServices() {
    const services = await this.serviceRegistryService.findAll();

    return services.map((s) => {
      const dto = new ServiceRegistryDto();
      dto.url= s.url
      dto.heartbeat_duration_in_sec= s.heartbeat_duration_in_sec
      dto.status= s.status
      dto.type = s.type

      return dto
    });
  }
}
