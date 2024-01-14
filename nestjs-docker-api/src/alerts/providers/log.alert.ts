import { Injectable, Logger } from '@nestjs/common';
import { Alert } from './alert.interface';

@Injectable()
export class LogAlert implements Alert {
  #logger = new Logger(LogAlert.name);

  trigger(message: string) {
    this.#logger.log(message);
  }
}
