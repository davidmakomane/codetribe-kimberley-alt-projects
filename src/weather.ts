import type { Place, WeatherData, Units } from './types';

const codes: Record<number, string> = { 0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm & hail', 99: 'Severe thunderstorm' };
export const description = (code: number) => codes[code] ?? 'Changing skies';
export const icon = (code: number, day = true) => code >= 95 ? '⛈' : code >= 71 ? '❄️' : code >= 61 || code >= 51 && code <= 57 || code >= 80 && code <= 82 ? '🌧' : code >= 45 ? '🌫' : code === 0 ? (day ? '☀️' : '🌙') : code <= 2 ? '⛅' : '☁️';
export const alertCode = (code: number) => code >= 95 || code === 82 || code === 65 || code === 75;

export async function searchPlaces(query: string): Promise<Place[]> {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=7&language=en&format=json`);
  if (!response.ok) throw new Error('Location search is unavailable. Please try again.');
  const data = await response.json();
  return (data.results ?? []).map((place: any) => ({ id: `${place.id}`, name: place.name, country: place.country ?? '', latitude: place.latitude, longitude: place.longitude, timezone: place.timezone ?? 'auto' }));
}

export async function getWeather(place: Place, units: Units): Promise<WeatherData> {
  const temperatureUnit = units === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const windUnit = units === 'fahrenheit' ? 'mph' : 'kmh';
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=${temperatureUnit}&wind_speed_unit=${windUnit}&timezone=auto&forecast_days=7`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather service is unavailable. Showing your last saved forecast.');
  return { ...await response.json(), fetchedAt: Date.now() };
}
