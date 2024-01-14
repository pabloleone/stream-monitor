import { Injectable } from '@nestjs/common';
import { Detector } from './detector.interface';

@Injectable()
export class ZScoreDetector implements Detector {
  constructor(
    public readonly mean: number,
    public readonly stdDev: number,
    public readonly threshold: number,
  ) {
    this.mean = mean;
    this.stdDev = stdDev;
    this.threshold = threshold;
  }

  isAnomaly(value: number): boolean {
    const zScore = (value - this.mean) / this.stdDev;
    return Math.abs(zScore) > this.threshold;
  }
}
