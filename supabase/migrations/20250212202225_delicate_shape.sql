/*
  # Add Default Founder Hero Video
  
  1. Changes
    - Insert default video record into founder_hero_video table
*/

INSERT INTO founder_hero_video (id, video_id, title)
VALUES (
  'default',
  'dQw4w9WgXcQ',
  'Welcome to Moses Choudary Ministries'
)
ON CONFLICT (id) DO NOTHING;