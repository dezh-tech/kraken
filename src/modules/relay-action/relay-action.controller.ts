import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ImportEventDto } from './dtos/import-event.dto';
import { ImportExportRelayActionService } from './import-export.service';

@Controller('relay-action')
@ApiTags('Relay actions')
export class RelayActionController {
  constructor(private readonly importExportService: ImportExportRelayActionService) {}

  @Post('import')
  async importEvents(@Body() prop: ImportEventDto) {
    return this.importExportService.importEvents(prop.pubkey, prop.relays);
  }
}
