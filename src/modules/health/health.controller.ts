import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@Controller('health')
export default class HealthController {
  private readonly startTime = Date.now();

  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HealthCheck()
  async check() {
    return {
      health: await this.health.check([async () => this.mongoose.pingCheck('mongoose')]),
      uptime: this.getFormattedUptime(),
    };
  }

  private getFormattedUptime() {
    const elapsedMs = Date.now() - this.startTime;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }
}
