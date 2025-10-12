-- Add current_page column to user_progress table
ALTER TABLE user_progress
ADD COLUMN current_page TEXT DEFAULT 'home';
