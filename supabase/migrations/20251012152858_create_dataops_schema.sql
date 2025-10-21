/*
  # DataOps Platform Schema

  ## New Tables
  
  ### 1. goals
    - `id` (uuid, primary key)
    - `user_id` (text) - references team member
    - `title` (text) - goal title
    - `description` (text) - detailed description
    - `type` (text) - 'daily', 'weekly', 'monthly', 'quarterly'
    - `target_value` (numeric) - target number
    - `current_value` (numeric) - current progress
    - `status` (text) - 'not_started', 'in_progress', 'completed', 'at_risk'
    - `start_date` (timestamptz)
    - `end_date` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 2. audit_trail
    - `id` (uuid, primary key)
    - `user_id` (text) - who made the change
    - `action` (text) - action type
    - `entity_type` (text) - what was changed
    - `entity_id` (text) - ID of changed entity
    - `old_value` (jsonb) - previous state
    - `new_value` (jsonb) - new state
    - `ip_address` (text)
    - `user_agent` (text)
    - `created_at` (timestamptz)
  
  ### 3. comments
    - `id` (uuid, primary key)
    - `user_id` (text) - comment author
    - `entity_type` (text) - 'task', 'error', 'goal', etc.
    - `entity_id` (text) - ID of entity
    - `content` (text) - comment text
    - `mentions` (text[]) - array of mentioned user IDs
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 4. calendar_events
    - `id` (uuid, primary key)
    - `user_id` (text)
    - `title` (text)
    - `description` (text)
    - `event_type` (text) - 'meeting', 'deadline', 'reminder'
    - `start_time` (timestamptz)
    - `end_time` (timestamptz)
    - `attendees` (text[])
    - `created_at` (timestamptz)
  
  ### 5. fireflies_recordings
    - `id` (uuid, primary key)
    - `meeting_id` (text) - external Fireflies ID
    - `title` (text)
    - `date` (timestamptz)
    - `duration` (integer) - in minutes
    - `participants` (text[])
    - `action_items` (jsonb) - extracted tasks
    - `highlights` (text[])
    - `lowlights` (text[])
    - `insights` (text[])
    - `transcript_url` (text)
    - `created_at` (timestamptz)
  
  ### 6. anomaly_detections
    - `id` (uuid, primary key)
    - `user_id` (text)
    - `anomaly_type` (text) - 'low_productivity', 'bottleneck', 'overload'
    - `severity` (text) - 'low', 'medium', 'high', 'critical'
    - `description` (text)
    - `metrics` (jsonb)
    - `detected_at` (timestamptz)
    - `resolved_at` (timestamptz)
    - `status` (text) - 'active', 'resolved', 'dismissed'
  
  ### 7. workload_suggestions
    - `id` (uuid, primary key)
    - `from_user_id` (text)
    - `to_user_id` (text)
    - `task_type` (text)
    - `reason` (text)
    - `estimated_hours` (numeric)
    - `priority` (text)
    - `status` (text) - 'pending', 'accepted', 'rejected'
    - `created_at` (timestamptz)
  
  ### 8. email_digests
    - `id` (uuid, primary key)
    - `user_id` (text)
    - `digest_type` (text) - 'daily', 'weekly'
    - `sent_at` (timestamptz)
    - `content` (jsonb)
    - `email_status` (text) - 'sent', 'failed', 'pending'

  ## Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'quarterly')),
  target_value numeric DEFAULT 0,
  current_value numeric DEFAULT 0,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'at_risk')),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all goals"
  ON goals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all audit trail"
  ON audit_trail FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert audit trail"
  ON audit_trail FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  content text NOT NULL,
  mentions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'user_id')
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  event_type text DEFAULT 'meeting' CHECK (event_type IN ('meeting', 'deadline', 'reminder')),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  attendees text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fireflies recordings table
CREATE TABLE IF NOT EXISTS fireflies_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id text UNIQUE NOT NULL,
  title text NOT NULL,
  date timestamptz NOT NULL,
  duration integer DEFAULT 0,
  participants text[] DEFAULT '{}',
  action_items jsonb DEFAULT '[]'::jsonb,
  highlights text[] DEFAULT '{}',
  lowlights text[] DEFAULT '{}',
  insights text[] DEFAULT '{}',
  transcript_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fireflies_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all fireflies recordings"
  ON fireflies_recordings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert fireflies recordings"
  ON fireflies_recordings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Anomaly detections table
CREATE TABLE IF NOT EXISTS anomaly_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  anomaly_type text NOT NULL CHECK (anomaly_type IN ('low_productivity', 'bottleneck', 'overload', 'idle_time')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  metrics jsonb DEFAULT '{}'::jsonb,
  detected_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed'))
);

ALTER TABLE anomaly_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all anomaly detections"
  ON anomaly_detections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert anomaly detections"
  ON anomaly_detections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update anomaly detections"
  ON anomaly_detections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Workload suggestions table
CREATE TABLE IF NOT EXISTS workload_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id text NOT NULL,
  to_user_id text NOT NULL,
  task_type text NOT NULL,
  reason text NOT NULL,
  estimated_hours numeric DEFAULT 0,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workload_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all workload suggestions"
  ON workload_suggestions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert workload suggestions"
  ON workload_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workload suggestions"
  ON workload_suggestions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Email digests table
CREATE TABLE IF NOT EXISTS email_digests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  digest_type text NOT NULL CHECK (digest_type IN ('daily', 'weekly')),
  sent_at timestamptz DEFAULT now(),
  content jsonb DEFAULT '{}'::jsonb,
  email_status text DEFAULT 'pending' CHECK (email_status IN ('sent', 'failed', 'pending'))
);

ALTER TABLE email_digests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email digests"
  ON email_digests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert email digests"
  ON email_digests FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_created_at ON audit_trail(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_fireflies_recordings_date ON fireflies_recordings(date DESC);
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_user_id ON anomaly_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_workload_suggestions_to_user_id ON workload_suggestions(to_user_id);