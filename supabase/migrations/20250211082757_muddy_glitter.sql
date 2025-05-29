/*
  # Add sample videos and gallery images

  1. New Data
    - Adds sample YouTube videos to the `youtube_videos` table
    - Adds sample gallery images to the `gallery_images` table
*/

INSERT INTO youtube_videos (title, video_id)
VALUES
  ('Sunday Service Highlights', 'dQw4w9WgXcQ'),
  ('Biblical Teaching Series - Episode 1', 'M7lc1UVf-VE'),
  ('Youth Conference 2024 Recap', '9bZkp7q19f0');

INSERT INTO gallery_images (title, image_url)
VALUES
  ('Community Service Day', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'),
  ('Youth Camp 2024', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'),
  ('Easter Celebration', 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'),
  ('Bible Study Group', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'),
  ('Children''s Ministry', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'),
  ('Worship Service', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');