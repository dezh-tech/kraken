import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ConfigService } from '../config.service';
import { UpdateConfigDto } from '../dto/update-config.dto';

@Controller('service-config')
@ApiTags('Service config')
export class ServiceConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Patch()
  async update(@Body() props: UpdateConfigDto) {
    return this.configService.update(props);
  }

  @Get()
  async get() {
    const config = await this.configService.getConfig();

    return config?.toDto();
  }
}
