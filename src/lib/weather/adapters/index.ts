// src/lib/weather/adapters/index.ts
import type { ProviderInfo, WeatherAdapter, WeatherProviderId } from './types';
import { openMeteoAdapter } from './openMeteo';

// Only implemented adapters go here
export const ADAPTERS: Partial<Record<WeatherProviderId, WeatherAdapter>> = {
  'open-meteo': openMeteoAdapter,
};

// This is the catalog your UI dropdown uses (can include “coming soon” providers)
export const PROVIDERS: ProviderInfo[] = [
  openMeteoAdapter.info,
  {
    id: 'openweather',
    label: 'OpenWeather',
    requiresKey: true,
    limit: { kind: 'daily', limit: 1000 },
  },
  {
    id: 'weatherapi',
    label: 'WeatherAPI.com',
    requiresKey: true,
    limit: { kind: 'daily', limit: 33000 },
  },
];

export function isProviderId(x: string | null): x is WeatherProviderId {
  return x === 'open-meteo' || x === 'openweather' || x === 'weatherapi';
}

export function getAdapter(id: WeatherProviderId): WeatherAdapter | undefined {
  return ADAPTERS[id];
}
