import { Module } from '@nestjs/common';
import { AlertsModule } from '../alerts/alerts.module';
import { ZScoreAnomaly } from './anomalies/z-score/z-score.anomaly';
import { MonitorModule } from 'src/monitor/monitor.module';

// TODO: I would probably move the schemas out of the MonitorModule to not depend on it
@Module({
  imports: [MonitorModule, AlertsModule],
  providers: [ZScoreAnomaly],
})
export class AnomalyDetectionModule {}
