import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18n } from 'i18n-js';
import translations from '../lib/i18n';

const i18n = new I18n(translations);
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language from AsyncStorage
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('app_language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
          i18n.locale = savedLanguage;
        } else {
          // Set default language based on system locale
          const systemLocale = i18n.defaultLocale || 'en';
          const supportedLocale = systemLocale.startsWith('tw') ? 'tw' : 'en';
          setLanguage(supportedLocale);
          i18n.locale = supportedLocale;
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    
    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
    try {
      await AsyncStorage.setItem('app_language', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string) => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};