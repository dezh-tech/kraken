import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ConfigService } from '../config.service';
import { UpdateNip11Dto } from '../dto/update-config.dto';
import JwtAuthGuard from '../../../../src/modules/auth/guards/jwt-auth.guard';

@Controller('config')
@ApiTags('config')
export class ServiceConfigController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  async update(@Body() props: UpdateNip11Dto) {
    return this.configService.updateNip11(props);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async get() {
    const config = await this.configService.getNip11();

    return config?.toDto();
  }
}
