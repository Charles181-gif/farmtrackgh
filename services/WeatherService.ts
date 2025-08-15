import * as Location from 'expo-location';

interface WeatherData {
  temperature: number;
  temperatureMin: number;
  temperatureMax: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  windDirection: string;
  icon: string;
  location: string;
}

class WeatherService {
  static async getCurrentWeather(): Promise<WeatherData> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return this.getDefaultWeather();
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );

      if (!response.ok) {
        return this.getDefaultWeather();
      }

      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      return {
        temperature: Math.round(current.temperature_2m),
        temperatureMin: Math.round(daily.temperature_2m_min[0]),
        temperatureMax: Math.round(daily.temperature_2m_max[0]),
        condition: this.mapWeatherCode(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        rainfall: daily.precipitation_probability_max[0] || 0,
        windDirection: this.getWindDirection(current.wind_direction_10m),
        icon: this.getWeatherIcon(current.weather_code),
        location: 'Current Location',
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return this.getDefaultWeather();
    }
  }

  private static getDefaultWeather(): WeatherData {
    return {
      temperature: 28,
      temperatureMin: 22,
      temperatureMax: 32,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      rainfall: 15,
      windDirection: 'NE',
      icon: 'cloud.sun.fill',
      location: 'Accra',
    };
  }

  private static mapWeatherCode(code: number): string {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rainy';
    if (code <= 99) return 'Stormy';
    return 'Partly Cloudy';
  }

  private static getWeatherIcon(code: number): string {
    if (code === 0) return 'sun.max.fill';
    if (code <= 3) return 'cloud.sun.fill';
    if (code <= 48) return 'cloud.fog.fill';
    if (code <= 67) return 'cloud.rain.fill';
    if (code <= 77) return 'cloud.snow.fill';
    if (code <= 82) return 'cloud.rain.fill';
    if (code <= 99) return 'cloud.bolt.rain.fill';
    return 'cloud.sun.fill';
  }

  private static getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
}

export default WeatherService;