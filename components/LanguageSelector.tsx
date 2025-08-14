import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export default function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {language === 'en' ? 'Select Language' : 'Paw Kasa'}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="English"
          onPress={() => handleLanguageChange('en')}
          variant={language === 'en' ? 'primary' : 'outline'}
          style={[styles.button, { marginRight: 8 }]}
        />
        <Button
          title="Twi"
          onPress={() => handleLanguageChange('tw')}
          variant={language === 'tw' ? 'primary' : 'outline'}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
});