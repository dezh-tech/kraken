import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { StringField } from '../../../../src/decorators';

export class ImportEventDto {
  @StringField()
  pubkey: string;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  relays: string[];
}
