import { PickType } from '@nestjs/swagger';

import { ServiceRegistryDto } from './service-registry.dto';

export default class RegisterServiceRegistry extends PickType(ServiceRegistryDto, [
  'url',
  'heartbeat_duration_in_sec',
  'type',
] as const) {}
