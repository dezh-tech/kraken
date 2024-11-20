import { OmitType, PartialType } from '@nestjs/swagger';

import { ConfigDto } from './config.dto';

export class UpdateConfigDto extends PartialType(OmitType(ConfigDto, ['id', 'createdAt', 'updatedAt'] as const)) {}
