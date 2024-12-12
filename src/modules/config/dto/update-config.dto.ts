import { OmitType, PartialType } from '@nestjs/swagger';

import { Nip11DTO } from './nip11.dto';

export class UpdateNip11Dto extends PartialType(OmitType(Nip11DTO, ['id', 'createdAt', 'updatedAt'] as const)) {}
