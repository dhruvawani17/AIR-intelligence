export interface StationMeta {
  id: string;
  code: string;
  name: string;
  operator: string;
  stationType: string;
  lat: number;
  lon: number;
  zone: string;
  description: string;
  elevationMeters: number;
  sensorId: string;
  metrics: {
    allTimeMean: number;
    recentPostMonsoonMean: number;
    minRecorded: number;
    maxRecorded: number;
    dataPoints: number;
    weekdayMean: number;
    weekendMean: number;
    peakHourIST: number;
    cleanestHourIST: number;
  };
  diurnalPattern: Array<{
    hour: number;
    mean: number;
    q25: number;
    q75: number;
    min: number;
    max: number;
  }>;
}

export interface StationFrameData {
  value: number;
  category: "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";
  color: string;
  status: "HISTORICAL_OBSERVED" | "GROUND_TRUTH_VERIFIED" | "ML_HARMONIC_FORECAST" | "SYNOPTIC_INTERPOLATION";
}

export interface TimelineFrame {
  timestamp: string;
  displayTime: string;
  isForecast: boolean;
  cityAverage: number;
  atmosphericPhase: string;
  windRegime: string;
  stations: Record<string, StationFrameData>;
}

export interface ModelExplainability {
  modelMetadata: {
    modelName: string;
    framework: string;
    leaderboardPublicScore: number;
    leaderboardRank: number;
    evaluationMetric: string;
    trainingWindow: string;
    regularizationAlpha: number;
    harmonics: Array<{
      name: string;
      frequency: string;
      physicalDriver: string;
    }>;
  };
  featureWeights: Array<{
    feature: string;
    importance: number;
    description: string;
  }>;
  modelValidation: {
    crossValidationRMSE: number;
    organizerBenchmarkRMSE: number;
    errorReductionVsBaselinePercent: number;
    precisionGroundTruthRows: number;
    historicalMatchRows: number;
    totalEvaluatedRows: number;
  };
  physicalMechanisms: Array<{
    phenomenon: string;
    stationAffected: string;
    impact: string;
    modeledAccurately: boolean;
  }>;
  scientificLimitations: string[];
}

