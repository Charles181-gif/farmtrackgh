import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { IconSymbol } from './ui/IconSymbol';
import WeatherService from '../services/WeatherService';

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

interface WeatherCardProps {
  location?: string;
  onPress?: () => void;
  weatherData?: WeatherData;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function WeatherCard({ location = "Accra", onPress, weatherData }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData>(weatherData || {
    temperature: 28,
    temperatureMin: 22,
    temperatureMax: 32,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    rainfall: 15,
    windDirection: "NE",
    icon: "cloud.sun.fill",
    location: "Accra"
  });
  const [loading, setLoading] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (weatherData) {
      setWeather(weatherData);
    } else {
      loadWeatherData();
    }
  }, [location, weatherData]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const weatherData = await WeatherService.getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return '#F59E0B';
      case 'cloudy':
      case 'overcast':
        return '#6B7280';
      case 'partly cloudy':
      case 'partly sunny':
        return '#3B82F6';
      case 'rainy':
      case 'light rain':
      case 'heavy rain':
        return '#0EA5E9';
      case 'stormy':
      case 'thunderstorm':
        return '#7C3AED';
      default:
        return '#10B981';
    }
  };

  const handlePress = () => {
    scale.value = withSpring(0.98, {}, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const refreshWeather = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await loadWeatherData();
  };

  const getWeatherAdvice = () => {
    const temp = weather.temperature;
    const humidity = weather.humidity;
    const rainfall = weather.rainfall;
    
    if (rainfall > 70) {
      return { text: "High chance of rain - postpone outdoor work", color: '#F59E0B' };
    } else if (temp > 35) {
      return { text: "Very hot - work early morning or evening", color: '#EF4444' };
    } else if (humidity > 80) {
      return { text: "High humidity - stay hydrated", color: '#3B82F6' };
    } else if (temp >= 25 && temp <= 30 && rainfall < 30) {
      return { text: "Perfect weather for farming!", color: '#10B981' };
    }
    return null;
  };

  const advice = getWeatherAdvice();

  return (
    <AnimatedTouchableOpacity
      style={animatedStyle}
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor: 'white',
            borderLeftWidth: 4,
            borderLeftColor: getWeatherColor(weather.condition)
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <IconSymbol name="location.fill" size={18} color="#10B981" />
            <Text style={styles.location}>{weather.location}</Text>
          </View>
          <TouchableOpacity 
            onPress={refreshWeather}
            style={styles.refreshButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol 
              name="arrow.clockwise" 
              size={16} 
              color="#6B7280" 
            />
            <Text style={styles.lastUpdated}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainWeather}>
          <View style={styles.temperatureContainer}>
            <IconSymbol 
              name={weather.icon} 
              size={56} 
              color={getWeatherColor(weather.condition)} 
            />
            <View style={styles.tempInfo}>
              <Text style={styles.temperature}>
                {weather.temperature}°C
              </Text>
              {weather.temperatureMin && weather.temperatureMax && (
                <Text style={styles.tempRange}>
                  {weather.temperatureMin}° - {weather.temperatureMax}°
                </Text>
              )}
            </View>
          </View>
          <Text style={styles.condition}>
            {weather.condition}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <IconSymbol name="drop.fill" size={24} color="#3B82F6" />
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>

          <View style={styles.detailItem}>
            <IconSymbol name="wind" size={24} color="#10B981" />
            <Text style={styles.detailValue}>
              {weather.windSpeed} km/h
            </Text>
            <Text style={styles.detailLabel}>Wind</Text>
          </View>

          <View style={styles.detailItem}>
            <IconSymbol name="cloud.rain.fill" size={24} color="#0EA5E9" />
            <Text style={styles.detailValue}>{weather.rainfall}%</Text>
            <Text style={styles.detailLabel}>Rain</Text>
          </View>
        </View>

        {advice && (
          <View style={[styles.adviceContainer, { backgroundColor: advice.color + '15' }]}>
            <IconSymbol name="lightbulb.fill" size={16} color={advice.color} />
            <Text style={[styles.adviceText, { color: advice.color }]}>
              {advice.text}
            </Text>
          </View>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 24,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tempInfo: {
    marginLeft: 16,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 40,
  },
  tempRange: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
    minHeight: 72,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  adviceText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
});