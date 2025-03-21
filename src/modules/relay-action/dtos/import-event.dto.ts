import { IsArray, IsString } from 'class-validator';
import { StringField } from '../../../../src/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class ImportEventDto {
  @StringField()
  pubkey: string;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  relays: string[];
}
