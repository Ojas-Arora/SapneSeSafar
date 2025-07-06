/*
  # Add Additional Features and Tables

  1. New Tables
    - `seasons`
      - Season statistics and metrics
    - `predictions`
      - ML-based predictions for startups
    - `sentiment_analysis`
      - Analysis of shark comments
    - `viral_moments`
      - Memorable quotes and memes
    - `audience_votes`
      - User voting system
    - `pitch_scores`
      - Founder pitch evaluations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Seasons Table
CREATE TABLE IF NOT EXISTS seasons (
  id SERIAL PRIMARY KEY,
  season_number INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  total_episodes INTEGER,
  total_deals INTEGER,
  total_investment DECIMAL,
  average_valuation DECIMAL,
  success_rate DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT REFERENCES deals(id),
  success_probability DECIMAL,
  predicted_valuation DECIMAL,
  risk_score INTEGER,
  growth_potential INTEGER,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sentiment Analysis Table
CREATE TABLE IF NOT EXISTS sentiment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT REFERENCES deals(id),
  shark_id UUID REFERENCES sharks(id),
  comment_text TEXT,
  sentiment_score DECIMAL,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Viral Moments Table
CREATE TABLE IF NOT EXISTS viral_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shark_id UUID REFERENCES sharks(id),
  season_id INTEGER REFERENCES seasons(id),
  episode_number INTEGER,
  quote TEXT,
  context TEXT,
  popularity_score INTEGER,
  video_timestamp TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audience Votes Table
CREATE TABLE IF NOT EXISTS audience_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  deal_id BIGINT REFERENCES deals(id),
  vote_type TEXT CHECK (vote_type IN ('invest', 'pass')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, deal_id)
);

-- Pitch Scores Table
CREATE TABLE IF NOT EXISTS pitch_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT REFERENCES deals(id),
  presentation_score INTEGER CHECK (presentation_score BETWEEN 1 AND 10),
  product_score INTEGER CHECK (product_score BETWEEN 1 AND 10),
  market_score INTEGER CHECK (market_score BETWEEN 1 AND 10),
  financials_score INTEGER CHECK (financials_score BETWEEN 1 AND 10),
  team_score INTEGER CHECK (team_score BETWEEN 1 AND 10),
  overall_score INTEGER GENERATED ALWAYS AS (
    (presentation_score + product_score + market_score + financials_score + team_score) / 5
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_scores ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Allow public read access on seasons"
  ON seasons FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on predictions"
  ON predictions FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on sentiment_analysis"
  ON sentiment_analysis FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on viral_moments"
  ON viral_moments FOR SELECT TO public USING (true);

-- Authenticated User Policies
CREATE POLICY "Allow authenticated users to vote"
  ON audience_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own votes"
  ON audience_votes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own votes"
  ON audience_votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);