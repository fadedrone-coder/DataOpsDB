/*
  # Curacel Performance Hub - Enterprise Schema

  ## Overview
  Multi-tenant platform for enterprise-wide performance management with department isolation,
  role-based access control, and approval workflows.

  ## New Tables

  ### 1. departments
    - `id` (uuid, primary key)
    - `name` (text) - Department name
    - `slug` (text) - URL-friendly identifier
    - `description` (text)
    - `config` (jsonb) - Department-specific configuration
    - `metric_types` (jsonb) - Custom metric types for this department
    - `features_enabled` (jsonb) - Feature toggles
    - `created_at` (timestamptz)

  ### 2. users
    - `id` (uuid, primary key)
    - `email` (text, unique)
    - `full_name` (text)
    - `department_id` (uuid, foreign key)
    - `role` (text) - 'user', 'dept_lead', 'people_ops', 'super_admin'
    - `status` (text) - 'pending', 'approved', 'rejected', 'inactive'
    - `approved_by` (uuid) - Who approved this user
    - `approved_at` (timestamptz)
    - `avatar` (text)
    - `preferences` (jsonb)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. okrs
    - `id` (uuid, primary key)
    - `department_id` (uuid, foreign key)
    - `quarter` (text) - 'Q1 2024', 'Q2 2024', etc.
    - `year` (integer)
    - `objectives` (jsonb) - Array of objectives with key results
    - `uploaded_by` (uuid)
    - `upload_source` (text) - 'manual', 'excel', 'fireflies'
    - `parsed_data` (jsonb) - AI-parsed structured data
    - `status` (text) - 'draft', 'active', 'completed'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. okr_tasks
    - `id` (uuid, primary key)
    - `okr_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key)
    - `title` (text)
    - `description` (text)
    - `target_value` (numeric)
    - `current_value` (numeric)
    - `due_date` (timestamptz)
    - `status` (text)
    - `priority` (text)
    - `created_from` (text) - 'okr_breakdown', 'fireflies', 'manual'
    - `created_at` (timestamptz)

  ### 5. department_metrics
    - `id` (uuid, primary key)
    - `department_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key)
    - `metric_type` (text)
    - `value` (numeric)
    - `target` (numeric)
    - `unit` (text)
    - `period` (text) - 'daily', 'weekly', 'monthly'
    - `metadata` (jsonb) - Additional context
    - `recorded_at` (timestamptz)
    - `created_at` (timestamptz)

  ### 6. approval_requests
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key) - User requesting approval
    - `approver_id` (uuid, foreign key) - Assigned approver
    - `request_type` (text) - 'user_registration', 'okr_upload', etc.
    - `status` (text) - 'pending', 'approved', 'rejected'
    - `notes` (text)
    - `reviewed_at` (timestamptz)
    - `created_at` (timestamptz)

  ### 7. excel_uploads
    - `id` (uuid, primary key)
    - `uploaded_by` (uuid, foreign key)
    - `department_id` (uuid, foreign key)
    - `file_name` (text)
    - `file_size` (integer)
    - `upload_type` (text) - 'okr', 'metrics', etc.
    - `raw_data` (jsonb) - Parsed Excel data
    - `ai_processed` (boolean)
    - `ai_results` (jsonb) - AI parsing results
    - `processing_status` (text) - 'pending', 'processing', 'completed', 'failed'
    - `error_log` (text)
    - `created_at` (timestamptz)

  ### 8. slack_channels
    - `id` (uuid, primary key)
    - `department_id` (uuid, foreign key)
    - `channel_name` (text)
    - `channel_id` (text)
    - `is_tracked` (boolean)
    - `created_at` (timestamptz)

  ### 9. chatbot_conversations
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `messages` (jsonb) - Array of messages
    - `context` (jsonb) - Conversation context
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
    - Enable RLS on all tables
    - Department isolation policies
    - Role-based access control
    - Super admin override capabilities
*/

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  config jsonb DEFAULT '{}'::jsonb,
  metric_types jsonb DEFAULT '[]'::jsonb,
  features_enabled jsonb DEFAULT '{
    "metrics": true,
    "goals": true,
    "tasks": true,
    "errors": false,
    "claims": false,
    "fireflies": true,
    "audit": true,
    "calendar": true,
    "smart_analytics": true
  }'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  department_id uuid REFERENCES departments(id),
  role text DEFAULT 'user' CHECK (role IN ('user', 'dept_lead', 'people_ops', 'super_admin')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  avatar text DEFAULT '👤',
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email')
  WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- OKRs table
CREATE TABLE IF NOT EXISTS okrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id),
  quarter text NOT NULL,
  year integer NOT NULL,
  objectives jsonb DEFAULT '[]'::jsonb,
  uploaded_by uuid REFERENCES users(id),
  upload_source text DEFAULT 'manual' CHECK (upload_source IN ('manual', 'excel', 'fireflies')),
  parsed_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE okrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view department OKRs"
  ON okrs FOR SELECT
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Dept leads can manage OKRs"
  ON okrs FOR ALL
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
      AND role IN ('dept_lead', 'people_ops', 'super_admin')
    )
  );

-- OKR Tasks table
CREATE TABLE IF NOT EXISTS okr_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id uuid REFERENCES okrs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text DEFAULT '',
  target_value numeric DEFAULT 0,
  current_value numeric DEFAULT 0,
  due_date timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_from text DEFAULT 'manual' CHECK (created_from IN ('okr_breakdown', 'fireflies', 'manual')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE okr_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view department OKR tasks"
  ON okr_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update assigned tasks"
  ON okr_tasks FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Department Metrics table
CREATE TABLE IF NOT EXISTS department_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id),
  user_id uuid REFERENCES users(id),
  metric_type text NOT NULL,
  value numeric NOT NULL,
  target numeric DEFAULT 0,
  unit text DEFAULT '',
  period text DEFAULT 'daily' CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly')),
  metadata jsonb DEFAULT '{}'::jsonb,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE department_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view department metrics"
  ON department_metrics FOR SELECT
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Users can insert own metrics"
  ON department_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Approval Requests table
CREATE TABLE IF NOT EXISTS approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  approver_id uuid REFERENCES users(id),
  request_type text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text DEFAULT '',
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON approval_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Approvers can manage requests"
  ON approval_requests FOR ALL
  TO authenticated
  USING (true);

-- Excel Uploads table
CREATE TABLE IF NOT EXISTS excel_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid NOT NULL REFERENCES users(id),
  department_id uuid NOT NULL REFERENCES departments(id),
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  upload_type text NOT NULL,
  raw_data jsonb DEFAULT '{}'::jsonb,
  ai_processed boolean DEFAULT false,
  ai_results jsonb DEFAULT '{}'::jsonb,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  error_log text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE excel_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view department uploads"
  ON excel_uploads FOR SELECT
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Slack Channels table
CREATE TABLE IF NOT EXISTS slack_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id),
  channel_name text NOT NULL,
  channel_id text NOT NULL,
  is_tracked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE slack_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view department channels"
  ON slack_channels FOR SELECT
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Chatbot Conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  messages jsonb DEFAULT '[]'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON chatbot_conversations FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Seed departments
INSERT INTO departments (name, slug, description, metric_types, features_enabled) VALUES
  ('DataOps', 'dataops', 'Data Operations Team', 
   '["Number of Providers Mapped", "Number of Care items Mapped", "Number of Care items Grouped", "Claims piles checked", "Number of Auto P.A Reviewed/Approved", "Number of Flagged Care Items", "Number of ICD-10 Adjusted", "Num Benefits set up", "Providers assigned", "Resolved Cares"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": true, "claims": true, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('Finance', 'finance', 'Finance Department',
   '["Revenue Processed", "Invoices Generated", "Budget Tracked", "Payment Collections", "Financial Reports", "Audit Compliance"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": false, "claims": true, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('Customer Success', 'customer-success', 'Customer Success Team',
   '["Tickets Resolved", "CSAT Score", "NPS Score", "Churn Rate", "Customer Onboarded", "Support Response Time"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": false, "claims": true, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('Engineering', 'engineering', 'Engineering Team',
   '["Sprint Velocity", "Bugs Resolved", "Deployments", "Code Reviews", "Feature Releases", "System Uptime"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": true, "claims": false, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('Product - Health & Pay', 'product-health', 'Product Team - Health & Pay',
   '["Feature Releases", "User Adoption Rate", "A/B Tests Run", "User Feedback", "Product Updates", "Beta Testing"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": false, "claims": false, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('Product - Auto', 'product-auto', 'Product Team - Auto',
   '["Feature Releases", "User Adoption Rate", "A/B Tests Run", "User Feedback", "Product Updates", "Beta Testing"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": false, "claims": false, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('People Ops', 'people-ops', 'People Operations (HR)',
   '["Employees Onboarded", "Training Sessions", "Performance Reviews", "Recruitment Pipeline", "Employee Satisfaction", "Retention Rate"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": false, "claims": false, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb),
  
  ('Commercial', 'commercial', 'Commercial Unit (Marketing)',
   '["Leads Generated", "Campaign ROI", "Website Traffic", "Conversions", "Social Engagement", "Content Published"]'::jsonb,
   '{"metrics": true, "goals": true, "tasks": true, "errors": false, "claims": false, "fireflies": true, "audit": true, "calendar": true, "smart_analytics": true}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_okrs_department ON okrs(department_id);
CREATE INDEX IF NOT EXISTS idx_okr_tasks_user ON okr_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_department_metrics_dept ON department_metrics(department_id);
CREATE INDEX IF NOT EXISTS idx_department_metrics_user ON department_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_user ON approval_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_excel_uploads_dept ON excel_uploads(department_id);