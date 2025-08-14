import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Card from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, Typography, Spacing, WeatherColors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';

interface WeatherData {
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  windDirection?: string;
  icon: string;
  lastUpdated: string;
}

interface WeatherCardProps {
  location?: string;
  onPress?: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function WeatherCard({ location = "Accra", onPress }: WeatherCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    temperatureMin: 22,
    temperatureMax: 32,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    rainfall: 15,
    windDirection: "NE",
    icon: "cloud.sun.fill",
    lastUpdated: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  });
  const [loading, setLoading] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Try to get cached weather data first
      const today = new Date().toISOString().split('T')[0];
      const { data: cachedWeather } = await supabase
        .from('weather_cache')
        .select('*')
        .eq('location', location)
        .eq('date', today)
        .single();

      if (cachedWeather) {
        setWeather({
          temperature: cachedWeather.temperature_max || 28,
          temperatureMin: cachedWeather.temperature_min || 22,
          temperatureMax: cachedWeather.temperature_max || 32,
          condition: cachedWeather.condition || "Partly Cloudy",
          humidity: cachedWeather.humidity || 65,
          windSpeed: cachedWeather.wind_speed || 12,
          rainfall: cachedWeather.rainfall || 15,
          windDirection: cachedWeather.wind_direction || "NE",
          icon: getWeatherIcon(cachedWeather.condition || "Partly Cloudy"),
          lastUpdated: new Date(cachedWeather.updated_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
      }
      
      // In a real app, you would fetch from a weather API here
      // and update the cache
      
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'sun.max.fill';
      case 'cloudy':
      case 'overcast':
        return 'cloud.fill';
      case 'partly cloudy':
      case 'partly sunny':
        return 'cloud.sun.fill';
      case 'rainy':
      case 'light rain':
        return 'cloud.rain.fill';
      case 'heavy rain':
        return 'cloud.heavyrain.fill';
      case 'stormy':
      case 'thunderstorm':
        return 'cloud.bolt.rain.fill';
      case 'foggy':
      case 'mist':
        return 'cloud.fog.fill';
      default:
        return 'cloud.sun.fill';
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return WeatherColors.sunny;
      case 'cloudy':
      case 'overcast':
        return WeatherColors.cloudy;
      case 'partly cloudy':
      case 'partly sunny':
        return WeatherColors.partlyCloudy;
      case 'rainy':
      case 'light rain':
      case 'heavy rain':
        return WeatherColors.rainy;
      case 'stormy':
      case 'thunderstorm':
        return WeatherColors.stormy;
      default:
        return colors.primary;
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
      return { text: "High chance of rain - postpone outdoor work", color: colors.warning };
    } else if (temp > 35) {
      return { text: "Very hot - work early morning or evening", color: colors.error };
    } else if (humidity > 80) {
      return { text: "High humidity - stay hydrated", color: colors.info };
    } else if (temp >= 25 && temp <= 30 && rainfall < 30) {
      return { text: "Perfect weather for farming!", color: colors.success };
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
      <Card 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            borderLeftWidth: 4,
            borderLeftColor: getWeatherColor(weather.condition)
          }
        ]} 
        variant="elevated"
      >
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <IconSymbol name="location.fill" size={18} color={colors.primary} />
            <Text style={[styles.location, { color: colors.text }]}>{location}</Text>
          </View>
          <TouchableOpacity 
            onPress={refreshWeather}
            style={styles.refreshButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol 
              name="arrow.clockwise" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
              {weather.lastUpdated}
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
              <Text style={[styles.temperature, { color: colors.text }]}>
                {weather.temperature}°C
              </Text>
              {weather.temperatureMin && weather.temperatureMax && (
                <Text style={[styles.tempRange, { color: colors.textSecondary }]}>
                  {weather.temperatureMin}° - {weather.temperatureMax}°
                </Text>
              )}
            </View>
          </View>
          <Text style={[styles.condition, { color: colors.textSecondary }]}>
            {weather.condition}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <IconSymbol name="drop.fill" size={24} color={colors.info} />
            <Text style={[styles.detailValue, { color: colors.text }]}>{weather.humidity}%</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Humidity</Text>
          </View>

          <View style={styles.detailItem}>
            <IconSymbol name="wind" size={24} color={colors.accent} />
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {weather.windSpeed} km/h
            </Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Wind</Text>
          </View>

          <View style={styles.detailItem}>
            <IconSymbol name="cloud.rain.fill" size={24} color={colors.info} />
            <Text style={[styles.detailValue, { color: colors.text }]}>{weather.rainfall}%</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Rain</Text>
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
      </Card>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginLeft: Spacing.xs,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: Typography.sizes.xs,
    marginLeft: 4,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tempInfo: {
    marginLeft: Spacing.md,
    alignItems: 'center',
  },
  temperature: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.extrabold,
    lineHeight: Typography.sizes['4xl'] * 1.1,
  },
  tempRange: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  condition: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
    minHeight: 72, // Larger touch target
  },
  detailValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginTop: 4,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  adviceText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginLeft: Spacing.xs,
    flex: 1,
  },
});