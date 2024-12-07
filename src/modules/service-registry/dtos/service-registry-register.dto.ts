import { PickType } from '@nestjs/swagger';

import { ServiceRegistryDto } from './service-registry.dto';

export default class RegisterServiceRegistryDto extends PickType(ServiceRegistryDto, [
  'url',
  'heartbeatDurationInSec',
  'type',
] as const) {}
