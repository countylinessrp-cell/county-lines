/*
  # County Lines Roleplay Database Schema

  ## Overview
  Creates the complete database structure for the County Lines FiveM roleplay server website including team members, whitelist applications, and server updates.

  ## New Tables
  
  ### 1. `team_members`
  Staff team member profiles displayed on the website
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Staff member's name/alias
  - `role` (text) - Their position (Owner, Admin, Developer, etc.)
  - `avatar_url` (text) - URL to their profile picture
  - `bio` (text, optional) - Short biography
  - `discord_tag` (text, optional) - Discord username
  - `display_order` (integer) - Order to display on page
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `whitelist_applications`
  Stores player whitelist application submissions
  - `id` (uuid, primary key) - Unique identifier
  - `discord_username` (text) - Applicant's Discord username
  - `in_game_name` (text) - Desired in-game name
  - `age` (integer) - Applicant's age
  - `timezone` (text) - Applicant's timezone
  - `experience` (text) - Previous RP experience
  - `character_story` (text) - Character backstory
  - `why_join` (text) - Why they want to join
  - `rules_agreed` (boolean) - Confirmed they read rules
  - `status` (text) - Application status (pending, approved, rejected)
  - `submitted_at` (timestamptz) - Submission timestamp
  - `reviewed_at` (timestamptz, optional) - When reviewed
  - `reviewed_by` (uuid, optional) - Staff member who reviewed

  ### 3. `server_updates`
  Server update announcements and changelogs
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Update title
  - `description` (text) - Update details
  - `update_type` (text) - Type: feature, bugfix, announcement, maintenance
  - `version` (text, optional) - Version number if applicable
  - `published_at` (timestamptz) - When update was published
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for team_members and server_updates
  - Public insert access for whitelist_applications
  - Only authenticated users can manage data (admin access)
*/

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  avatar_url text,
  bio text,
  discord_tag text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (true);

-- Whitelist Applications Table
CREATE TABLE IF NOT EXISTS whitelist_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_username text NOT NULL,
  in_game_name text NOT NULL,
  age integer NOT NULL,
  timezone text NOT NULL,
  experience text NOT NULL,
  character_story text NOT NULL,
  why_join text NOT NULL,
  rules_agreed boolean DEFAULT false,
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

ALTER TABLE whitelist_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications"
  ON whitelist_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (rules_agreed = true);

CREATE POLICY "Authenticated users can view applications"
  ON whitelist_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON whitelist_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Server Updates Table
CREATE TABLE IF NOT EXISTS server_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  update_type text DEFAULT 'announcement',
  version text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE server_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view server updates"
  ON server_updates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert server updates"
  ON server_updates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update server updates"
  ON server_updates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete server updates"
  ON server_updates FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_applications_status ON whitelist_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON whitelist_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_updates_published ON server_updates(published_at DESC);