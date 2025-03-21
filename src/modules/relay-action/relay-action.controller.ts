import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImportExportRelayActionService } from './import-export.service';
import { ImportEventDto } from './dtos/import-event.dto';

@Controller('relay-action')
@ApiTags('Relay actions')
export class RelayActionController {
  constructor(private readonly importExportService: ImportExportRelayActionService) {}

  @Post('import')
  async importEvents(@Body() prop: ImportEventDto) {
    return this.importExportService.importEvents(prop.pubkey, prop.relays);
  }
}
