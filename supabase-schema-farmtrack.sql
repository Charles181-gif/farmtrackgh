-- FarmTrack Production Database Schema
-- Optimized for farming operations with offline support

-- Users/Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  preferred_units TEXT DEFAULT 'metric', -- metric/imperial
  language TEXT DEFAULT 'en',
  location TEXT,
  farm_size DECIMAL,
  farm_type TEXT,
  avatar_url TEXT,
  push_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tasks table - core farming activities
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- planting, irrigation, harvesting, fertilizing, weeding, pest_control
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  due_date DATE,
  due_time TIME,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  estimated_duration INTEGER, -- minutes
  actual_duration INTEGER, -- minutes
  weather_dependent BOOLEAN DEFAULT FALSE,
  recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern TEXT, -- daily, weekly, monthly
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops table - what farmers grow
CREATE TABLE IF NOT EXISTS crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  variety TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  area_planted DECIMAL, -- in hectares or acres
  status TEXT DEFAULT 'growing', -- planted, growing, harvested, failed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Harvests table - track what's harvested
CREATE TABLE IF NOT EXISTS harvests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  crop_type TEXT NOT NULL,
  quantity_kg DECIMAL NOT NULL,
  quality_grade TEXT, -- A, B, C, D
  price_per_kg DECIMAL,
  total_value DECIMAL,
  buyer TEXT,
  date DATE NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table - farm costs
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- seeds, fertilizer, pesticides, labor, equipment, fuel, other
  subcategory TEXT,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'GHS',
  description TEXT,
  supplier TEXT,
  date DATE NOT NULL,
  receipt_url TEXT,
  tax_deductible BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather cache table - for offline access
CREATE TABLE IF NOT EXISTS weather_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  temperature_max DECIMAL,
  temperature_min DECIMAL,
  humidity DECIMAL,
  rainfall DECIMAL,
  wind_speed DECIMAL,
  wind_direction TEXT,
  condition TEXT,
  forecast_data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location, date)
);

-- Market prices table - crop pricing data
CREATE TABLE IF NOT EXISTS market_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  market_location TEXT NOT NULL,
  price_per_kg DECIMAL NOT NULL,
  currency TEXT DEFAULT 'GHS',
  date DATE NOT NULL,
  source TEXT,
  quality_grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(crop_name, market_location, date, quality_grade)
);

-- Farm tips/advice table
CREATE TABLE IF NOT EXISTS farm_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- planting, pest_control, irrigation, harvesting, general
  crop_type TEXT,
  season TEXT,
  region TEXT,
  language TEXT DEFAULT 'en',
  author TEXT,
  image_url TEXT,
  video_url TEXT,
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table - for reminders and alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- task_reminder, weather_alert, price_alert, tip
  related_id UUID, -- task_id, tip_id, etc.
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_push_token ON profiles(push_token) WHERE push_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks(user_id, due_date);

CREATE INDEX IF NOT EXISTS idx_crops_user_id ON crops(user_id);
CREATE INDEX IF NOT EXISTS idx_crops_status ON crops(status);
CREATE INDEX IF NOT EXISTS idx_crops_planting_date ON crops(planting_date);

CREATE INDEX IF NOT EXISTS idx_harvests_user_id ON harvests(user_id);
CREATE INDEX IF NOT EXISTS idx_harvests_date ON harvests(date);
CREATE INDEX IF NOT EXISTS idx_harvests_crop_type ON harvests(crop_type);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

CREATE INDEX IF NOT EXISTS idx_weather_location_date ON weather_cache(location, date);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_date ON market_prices(crop_name, date);
CREATE INDEX IF NOT EXISTS idx_farm_tips_category ON farm_tips(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_scheduled ON notifications(user_id, scheduled_for);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Crops policies
CREATE POLICY "Users can view own crops" ON crops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crops" ON crops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crops" ON crops FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own crops" ON crops FOR DELETE USING (auth.uid() = user_id);

-- Harvests policies
CREATE POLICY "Users can view own harvests" ON harvests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own harvests" ON harvests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own harvests" ON harvests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own harvests" ON harvests FOR DELETE USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Public read access for shared data
CREATE POLICY "Anyone can view weather cache" ON weather_cache FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view market prices" ON market_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view farm tips" ON farm_tips FOR SELECT TO authenticated USING (active = true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON crops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_harvests_updated_at BEFORE UPDATE ON harvests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farm_tips_updated_at BEFORE UPDATE ON farm_tips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for analytics
CREATE VIEW user_dashboard_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.completed = false AND t.due_date >= CURRENT_DATE THEN t.id END) as pending_tasks,
  COUNT(DISTINCT CASE WHEN t.completed = false AND t.due_date < CURRENT_DATE THEN t.id END) as overdue_tasks,
  COUNT(DISTINCT h.id) as total_harvests,
  COALESCE(SUM(h.total_value), 0) as total_harvest_value,
  COUNT(DISTINCT e.id) as total_expenses,
  COALESCE(SUM(e.amount), 0) as total_expense_amount,
  COUNT(DISTINCT c.id) as active_crops
FROM auth.users u
LEFT JOIN tasks t ON u.id = t.user_id
LEFT JOIN harvests h ON u.id = h.user_id AND h.date >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN expenses e ON u.id = e.user_id AND e.date >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN crops c ON u.id = c.user_id AND c.status IN ('planted', 'growing')
GROUP BY u.id;

-- Sample data for testing (optional)
INSERT INTO farm_tips (title, content, category, crop_type, language) VALUES
('Best Time to Plant Maize', 'Plant maize at the beginning of the rainy season when soil moisture is adequate. Ensure soil temperature is above 10°C for optimal germination.', 'planting', 'maize', 'en'),
('Tomato Pest Control', 'Use neem oil spray to control aphids and whiteflies on tomato plants. Apply early morning or late evening to avoid leaf burn.', 'pest_control', 'tomato', 'en'),
('Efficient Irrigation Tips', 'Water crops early morning or late evening to reduce evaporation. Use drip irrigation for water conservation.', 'irrigation', null, 'en'),
('Harvest Timing for Rice', 'Harvest rice when 80-85% of grains are golden yellow. Moisture content should be around 20-25% for optimal quality.', 'harvesting', 'rice', 'en');

INSERT INTO market_prices (crop_name, market_location, price_per_kg, date) VALUES
('Maize', 'Accra Central Market', 3.50, CURRENT_DATE),
('Tomato', 'Accra Central Market', 8.00, CURRENT_DATE),
('Rice', 'Kumasi Market', 6.50, CURRENT_DATE),
('Cassava', 'Tamale Market', 2.80, CURRENT_DATE),
('Plantain', 'Accra Central Market', 4.20, CURRENT_DATE);