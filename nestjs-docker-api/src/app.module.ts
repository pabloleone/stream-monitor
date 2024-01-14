import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnomalyDetectionModule } from './anomaly-detection/anomaly-detection.module';
import { MonitorModule } from './monitor/monitor.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AnomalyDetectionModule,
    MonitorModule,
    AlertsModule,
  ],
})
export class AppModule {}
