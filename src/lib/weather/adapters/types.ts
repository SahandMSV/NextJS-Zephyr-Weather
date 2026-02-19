// src/lib/weather/adapters/types.ts
export type WeatherProviderId = 'open-meteo' | 'openweather' | 'weatherapi';

export type ApiLimit =
  | { kind: 'none' }
  | { kind: 'daily'; limit: number }
  | { kind: 'monthly'; limit: number };

export type ProviderInfo = {
  id: WeatherProviderId;
  label: string;
  requiresKey: boolean;
  limit: ApiLimit;
};

export type ForecastPoint = {
  timeISO: string;
  tempC?: number;
  windKph?: number;
  humidityPct?: number;
  precipMm?: number;
  weatherCode?: number;
};

export type NormalizedForecast = {
  provider: WeatherProviderId;
  location: { lat: number; lon: number };
  timezone?: string;
  updatedAtISO: string;
  current?: ForecastPoint;
  hourly: ForecastPoint[];
};

export type GetForecastInput = {
  lat: number;
  lon: number;
  forecastDays?: number;
};

export interface WeatherAdapter {
  info: ProviderInfo;
  getForecast(input: GetForecastInput): Promise<NormalizedForecast>;
}
