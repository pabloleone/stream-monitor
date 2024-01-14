import { Module } from '@nestjs/common';
import { AlertService } from './alerts.service';
import { LogAlert } from './providers/log.alert';

@Module({
  providers: [AlertService, LogAlert],
  exports: [AlertService],
})
export class AlertsModule {}
