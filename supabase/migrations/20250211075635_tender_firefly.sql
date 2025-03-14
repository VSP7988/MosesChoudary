/*
  # Add Initial Banner Slides

  1. Changes
    - Insert 5 banner slides with images and content
  2. Security
    - No security changes needed (using existing RLS policies)
*/

INSERT INTO banners (title, subtitle, image_url)
VALUES
  (
    'Spreading Hope Through Faith',
    'Join us in our mission to transform lives through spiritual guidance and community service',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Empowering Communities',
    'Building stronger communities through education, support, and spiritual growth',
    'https://images.unsplash.com/photo-1511649475669-e288648b2339?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Serving with Compassion',
    'Reaching out to those in need through our children''s homes and elderly care services',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Growing in Faith Together',
    'Join our vibrant community of believers in worship, prayer, and fellowship',
    'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Biblical Education & Training',
    'Equipping leaders through our Bible schools and theological seminaries',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  );