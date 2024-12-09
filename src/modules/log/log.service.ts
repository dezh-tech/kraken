import { Injectable } from '@nestjs/common';

import type { AddLogDto } from './dtos/add-log.dto';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  addLog(props: AddLogDto) {
    const log = this.logRepository.create(props);

    return this.logRepository.save(log);
  }
}
