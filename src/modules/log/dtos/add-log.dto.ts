import { PickType } from '@nestjs/swagger';

import { LogDto } from './log.dto';

export class AddLogDto extends PickType(LogDto, ['message', 'stack', 'serviceId'] as const) {}
