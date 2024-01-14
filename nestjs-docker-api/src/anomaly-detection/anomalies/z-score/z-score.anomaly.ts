import { Injectable, Logger } from '@nestjs/common';
import { Anomaly } from '../anomaly.interface';
import { ZScoreDetector } from './detectors/z-score.detector';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stream, StreamDocument } from '../../../monitor/schemas/stream.schema';
import { AlertService } from '../../../alerts/alerts.service';

@Injectable()
export class ZScoreAnomaly implements Anomaly {
  #logger = new Logger(ZScoreAnomaly.name);

  // set the mean for the baseline
  #baselineMean = 3;

  // set the standard deviation for the baseline
  #baselineStdDev = 1;

  // set the threshold for the anomaly detection
  #anomalyThreshold = 5;

  // set the time frame to be monitored in milliseconds
  #shiftingTimeWindow = 1000;

  // set the hashtag to be monitored
  #hashtag = 'covid';

  constructor(
    @InjectModel(Stream.name)
    private readonly streamModel: Model<StreamDocument>,
    private readonly alerts: AlertService,
  ) {
    // running the real-time monitor as a deamon
    this.run();
  }

  async run() {
    this.#logger.log(`${ZScoreAnomaly.name}: Checking for anomalies...`);

    // configuring the z-score anomaly detector
    const anomalyDetector = new ZScoreDetector(
      this.#baselineMean,
      this.#baselineStdDev,
      this.#anomalyThreshold,
    );

    setInterval(() => {
      // getting the records within the time frame
      const lastTimeShift = new Date();
      lastTimeShift.setSeconds(
        lastTimeShift.getSeconds() - this.#shiftingTimeWindow / 1000,
      );

      // counting the number of records within the time frame which content contains the hashtag
      this.streamModel
        .countDocuments({
          created: { $gte: lastTimeShift },
          content: { $regex: `#${this.#hashtag}`, $options: 'i' },
        })
        .then((currentNumberOfRecords) => {
          if (anomalyDetector.isAnomaly(currentNumberOfRecords)) {
            // triggering the alert if anomaly is detected
            this.alerts.trigger(anomalyDetector);
          }
        });
    }, this.#shiftingTimeWindow);
  }
}
