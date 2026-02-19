import type { NormalizedForecast, WeatherAdapter } from './types';

type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  timezone?: string;
  current?: {
    time: string;
    temperature_2m?: number;
    wind_speed_10m?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
    weather_code?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m?: number[];
    wind_speed_10m?: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
    weather_code?: number[];
  };
};

function zipHourly(r: OpenMeteoResponse): NormalizedForecast['hourly'] {
  const t = r.hourly?.time ?? [];
  const temp = r.hourly?.temperature_2m ?? [];
  const wind = r.hourly?.wind_speed_10m ?? [];
  const rh = r.hourly?.relative_humidity_2m ?? [];
  const precip = r.hourly?.precipitation ?? [];
  const code = r.hourly?.weather_code ?? [];

  return t.map((timeISO, i) => ({
    timeISO,
    tempC: temp[i],
    windKph: wind[i],
    humidityPct: rh[i],
    precipMm: precip[i],
    weatherCode: code[i],
  }));
}

export const openMeteoAdapter: WeatherAdapter = {
  info: {
    id: 'open-meteo',
    label: 'Open‑Meteo',
    requiresKey: false,
    limit: { kind: 'none' },
  },

  async getForecast({ lat, lon, forecastDays = 7 }) {
    // Docs: /v1/forecast with latitude/longitude + hourly/current + timezone + forecast_days. [page:0]
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('timezone', 'auto'); // supported by Open‑Meteo [page:0]
    url.searchParams.set('forecast_days', String(forecastDays)); // up to 16 [page:0]

    // Use variables from Open‑Meteo "Hourly Parameter Definition". [page:0]
    url.searchParams.set(
      'hourly',
      [
        'temperature_2m',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'relative_humidity_2m',
      ].join(','),
    );

    // Use variables from Open‑Meteo "current" list. [page:0]
    url.searchParams.set(
      'current',
      [
        'temperature_2m',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'relative_humidity_2m',
      ].join(','),
    );

    const res = await fetch(url.toString(), {
      // Cache upstream response briefly to avoid hammering the provider during dev refreshes
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Open‑Meteo error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as OpenMeteoResponse;

    const hourly = zipHourly(data);
    const current = data.current
      ? {
          timeISO: data.current.time,
          tempC: data.current.temperature_2m,
          windKph: data.current.wind_speed_10m,
          humidityPct: data.current.relative_humidity_2m,
          precipMm: data.current.precipitation,
          weatherCode: data.current.weather_code,
        }
      : undefined;

    return {
      provider: 'open-meteo',
      location: { lat, lon },
      timezone: data.timezone,
      updatedAtISO: new Date().toISOString(),
      current,
      hourly,
    };
  },
};
