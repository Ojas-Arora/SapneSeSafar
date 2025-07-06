/*
  # Initial Schema Setup for Shark Tank India Analytics

  1. New Tables
    - `deals`: Stores information about each pitch and deal
    - `sharks`: Stores information about each shark
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage their data
*/

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id BIGSERIAL PRIMARY KEY,
  season INTEGER NOT NULL,
  episode INTEGER NOT NULL,
  startup_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  ask_amount DECIMAL NOT NULL,
  ask_equity DECIMAL NOT NULL,
  valuation DECIMAL NOT NULL,
  deal_amount DECIMAL,
  deal_equity DECIMAL,
  deal_debt DECIMAL DEFAULT 0,
  multiple_sharks BOOLEAN DEFAULT false,
  interested_sharks TEXT[] DEFAULT '{}',
  invested_sharks TEXT[] DEFAULT '{}',
  success_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create sharks table
CREATE TABLE IF NOT EXISTS sharks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  total_deals INTEGER DEFAULT 0,
  total_investment DECIMAL DEFAULT 0,
  appearances INTEGER[] DEFAULT '{}',
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on deals"
  ON deals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on sharks"
  ON sharks
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to insert deals"
  ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update deals"
  ON deals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage sharks"
  ON sharks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);