import { Injectable } from '@nestjs/common';
import { Detector } from 'src/anomaly-detection/anomalies/z-score/detectors/detector.interface';
import { LogAlert } from './providers/log.alert';
import { Alert } from './providers/alert.interface';

@Injectable()
export class AlertService {
  #alertProviders: Alert[] = [this.logAlert];

  constructor(private readonly logAlert: LogAlert) {}

  async trigger(detector: Detector) {
    const message = `Anomaly detected: Number of records is deviating significantly from the baseline (${detector.mean}).`;
    this.#alertProviders.forEach((alertProvider) => {
      alertProvider.trigger(message);
    });
  }
}
