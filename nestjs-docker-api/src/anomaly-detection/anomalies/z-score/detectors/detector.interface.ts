export interface Detector {
  mean: number;
  stdDev: number;
  threshold: number;
  isAnomaly(value: number): boolean;
}
