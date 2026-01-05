# Database Setup Guide - Supabase

## ⚠️ IMPORTANT: Ye zaroor apply karna hai articles save karne ke liye!

### Step 1: Supabase Dashboard Mein Jaao
1. https://supabase.com login karو
2. Apna project select karo
3. **SQL Editor** pe click karo (left sidebar mein)

### Step 2: SQL Code Run Karo

Is poore code ko copy karke SQL Editor mein paste karo aur **RUN** button dabo:

```sql
-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS feed_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Anyone can view articles
CREATE POLICY "Anyone can view articles"
  ON articles FOR SELECT
  USING (true);

-- RLS Policy - Login users only add articles
CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = author_id AND auth.role() = 'authenticated');

-- RLS Policy - Users update apne articles only
CREATE POLICY "Users can update own articles"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id);

-- RLS Policy - Users delete apne articles only
CREATE POLICY "Users can delete own articles"
  ON articles FOR DELETE
  USING (auth.uid() = author_id);

-- Topics - Anyone can view
CREATE POLICY "Anyone can view topics"
  ON feed_topics FOR SELECT
  USING (true);

-- Chat - Login users only view
CREATE POLICY "Authenticated users can view messages"
  ON chat_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Chat - Login users only send
CREATE POLICY "Authenticated users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_messages(created_at DESC);

-- Insert default topics
INSERT INTO feed_topics (title, description, icon, category, is_active) VALUES
  ('Shark Tank India Updates', 'Latest news and updates from Shark Tank India', '📺', 'news', TRUE),
  ('Success Stories', 'Inspiring stories of startups that made it big', '🚀', 'success', TRUE),
  ('Investment Insights', 'Analysis of deals and investment patterns', '💰', 'insights', TRUE),
  ('Startup Tips', 'Learn from the best pitches and strategies', '💡', 'education', TRUE),
  ('Shark Profiles', 'Deep dives into the sharks and their portfolios', '🦈', 'profiles', TRUE),
  ('Industry Trends', 'Market trends and sector analysis', '📊', 'trends', TRUE)
ON CONFLICT DO NOTHING;
```

### Step 3: Verify Tables Created Hain

**Table Editor** mein jaao (left sidebar) aur check karo:
- `articles` table exist karta hai?
- `feed_topics` table exist karta hai?
- `chat_messages` table exist karta hai?

Agar green checkmark ho toh sab sahi hai ✅

### Step 4: Test Karo

1. Website refresh karo
2. Login karo
3. Home page pe jaao
4. "Add Article" button pe click karo
5. Title, Description, Link daalo
6. "Publish Article" button dabo

**Article permanently save hoga Supabase mein!**

---

## Troubleshooting

### Problem: "Error: 42P01 - relation does not exist"
**Solution:** SQL code above run nahi hua. Phir se copy-paste karke RUN karo.

### Problem: "Error: new row violates row-level security policy"
**Solution:** Login zyada acche se check karo. Make sure auth.uid() match kar raha hai.

### Problem: Article add ho gaya but refresh par delete ho gaya
**Solution:** Iska matlab database save nahi ho raha. Table check karo - exist karta hai ya nahi?

### Problem: "Table 'articles' not found"
**Solution:** SQL code definitely run karna padega. SQL Editor mein paste karke RUN button dabo.

---

## Database Structure

### articles table
```
- id (UUID) - unique ID
- title (TEXT) - article ka title
- description (TEXT) - short description
- link (TEXT) - article ka link
- author_id (UUID) - jo user add kiya
- author_name (TEXT) - user ka naam
- created_at (TIMESTAMP) - kab add kiya
- updated_at (TIMESTAMP) - kab update kiya
```

### chat_messages table
```
- id (UUID) - unique ID
- user_id (UUID) - jo user message bheja
- user_name (TEXT) - user ka naam
- message (TEXT) - message content
- created_at (TIMESTAMP) - kab bheja
```

---

## Auto-Cleanup (30 days)

Chat messages 30 days baad automatically delete ho jayenge. Ye Supabase mein set hai toh manually kuch karne ki zaroorat nahi.

---

**Agar setup ho gaya toh articles persist hoge aur refresh ke baad bhi save rahenge! 🎉**
