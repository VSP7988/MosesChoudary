/*
  # Add sample events

  1. New Data
    - Adds sample events to the `events` table
    - Each event includes title, description, date, and image
*/

INSERT INTO events (title, description, date, image_url)
VALUES
  (
    'Annual Bible Conference 2025',
    'Join us for three days of inspiring messages, worship, and fellowship. Special guest speakers from around the world will share insights from God''s Word.',
    '2025-03-15',
    'https://images.unsplash.com/photo-1472653431158-6364773b2a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Youth Leadership Summit',
    'Empowering the next generation of leaders through workshops, mentoring sessions, and practical leadership training.',
    '2025-04-01',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Community Outreach Program',
    'Making a difference in our community through various service projects, including food distribution and health camps.',
    '2025-04-15',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Easter Celebration Service',
    'Join us for a special Easter service celebrating the resurrection of Jesus Christ with music, drama, and an inspiring message.',
    '2025-04-20',
    'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ),
  (
    'Children''s Summer Bible Camp',
    'A week-long adventure for children ages 5-12 filled with Bible stories, crafts, games, and fun activities.',
    '2025-05-01',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  );