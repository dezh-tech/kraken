import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ConfigService } from '../config.service';
import { UpdateNip11Dto } from '../dto/update-config.dto';
import { updateLimitationDto } from '../dto/update-limitation.dto';

@Controller('config')
@ApiTags('config')
export class ServiceConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Patch()
  async update(@Body() props: UpdateNip11Dto) {
    return this.configService.updateNip11(props);
  }

  @Get()
  async get() {
    const config = await this.configService.getNip11();

    return config?.toDto();
  }
}
