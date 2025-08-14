import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yrjgfbisuerpidtqihyv.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyamdmYmlzdWVycGlkdHFpaHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NDQ3ODgsImV4cCI6MjA3MDUyMDc4OH0.fatnGJyoW-p4KOjblwdrAHbCx4EyKzJH0OE4afC2S-c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    redirectTo: 'https://yrjgfbisuerpidtqihyv.supabase.co/auth/v1/callback',
  },
})

// Database types for FarmTrack
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          email: string | null
          preferred_units: string
          language: string
          location: string | null
          farm_size: number | null
          farm_type: string | null
          avatar_url: string | null
          push_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          email?: string | null
          preferred_units?: string
          language?: string
          location?: string | null
          farm_size?: number | null
          farm_type?: string | null
          avatar_url?: string | null
          push_token?: string | null
        }
        Update: {
          name?: string | null
          phone?: string | null
          email?: string | null
          preferred_units?: string
          language?: string
          location?: string | null
          farm_size?: number | null
          farm_type?: string | null
          avatar_url?: string | null
          push_token?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          priority: string
          due_date: string | null
          due_time: string | null
          completed: boolean
          completed_at: string | null
          location: string | null
          estimated_duration: number | null
          actual_duration: number | null
          weather_dependent: boolean
          recurring: boolean
          recurring_pattern: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          category: string
          priority?: string
          due_date?: string | null
          due_time?: string | null
          completed?: boolean
          location?: string | null
          estimated_duration?: number | null
          weather_dependent?: boolean
          recurring?: boolean
          recurring_pattern?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          category?: string
          priority?: string
          due_date?: string | null
          due_time?: string | null
          completed?: boolean
          completed_at?: string | null
          location?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          weather_dependent?: boolean
          recurring?: boolean
          recurring_pattern?: string | null
        }
      }
      crops: {
        Row: {
          id: string
          user_id: string
          name: string
          variety: string | null
          planting_date: string | null
          expected_harvest_date: string | null
          actual_harvest_date: string | null
          area_planted: number | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      harvests: {
        Row: {
          id: string
          user_id: string
          crop_id: string | null
          crop_type: string
          quantity_kg: number
          quality_grade: string | null
          price_per_kg: number | null
          total_value: number | null
          buyer: string | null
          date: string
          location: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          crop_id?: string | null
          crop_type: string
          quantity_kg: number
          quality_grade?: string | null
          price_per_kg?: number | null
          total_value?: number | null
          buyer?: string | null
          date: string
          location?: string | null
          notes?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category: string
          subcategory: string | null
          amount: number
          currency: string
          description: string | null
          supplier: string | null
          date: string
          receipt_url: string | null
          tax_deductible: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          category: string
          subcategory?: string | null
          amount: number
          currency?: string
          description?: string | null
          supplier?: string | null
          date: string
          receipt_url?: string | null
          tax_deductible?: boolean
          notes?: string | null
        }
      }
      weather_cache: {
        Row: {
          id: string
          location: string
          date: string
          temperature_max: number | null
          temperature_min: number | null
          humidity: number | null
          rainfall: number | null
          wind_speed: number | null
          wind_direction: string | null
          condition: string | null
          forecast_data: any | null
          updated_at: string
        }
      }
      market_prices: {
        Row: {
          id: string
          crop_name: string
          market_location: string
          price_per_kg: number
          currency: string
          date: string
          source: string | null
          quality_grade: string | null
          created_at: string
        }
      }
      farm_tips: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          crop_type: string | null
          season: string | null
          region: string | null
          language: string
          author: string | null
          image_url: string | null
          video_url: string | null
          priority: number
          active: boolean
          created_at: string
          updated_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          related_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          read_at: string | null
          data: any | null
          created_at: string
        }
      }
    }
    Views: {
      user_dashboard_stats: {
        Row: {
          user_id: string
          total_tasks: number
          pending_tasks: number
          overdue_tasks: number
          total_harvests: number
          total_harvest_value: number
          total_expenses: number
          total_expense_amount: number
          active_crops: number
        }
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Crop = Database['public']['Tables']['crops']['Row']
export type Harvest = Database['public']['Tables']['harvests']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type WeatherData = Database['public']['Tables']['weather_cache']['Row']
export type MarketPrice = Database['public']['Tables']['market_prices']['Row']
export type FarmTip = Database['public']['Tables']['farm_tips']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type DashboardStats = Database['public']['Views']['user_dashboard_stats']['Row']