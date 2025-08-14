declare module 'expo-font';
declare module 'expo-status-bar';
declare module 'expo-haptics';
declare module '@react-native-async-storage/async-storage';

declare module '@supabase/supabase-js' {
  export interface Session {
    [key: string]: any;
  }
  
  export interface User {
    [key: string]: any;
  }
  
  export function createClient(url: string, key: string): any;
}