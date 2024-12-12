import { OmitType, PartialType } from '@nestjs/swagger';
import { LimitationDto } from './limitation.dto';

export class updateLimitationDto extends PartialType(OmitType(LimitationDto, ['id', 'createdAt', 'updatedAt'] as const)) {}
