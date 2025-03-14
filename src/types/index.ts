export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
  created_at: string;
}

export interface YoutubeVideo {
  id: string;
  video_id: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

export interface Banner {
  id: string;
  subtitle: string;
  image_url: string;
  created_at: string;
}

export interface Certification {
  id: string;
  title: string;
  image_url: string;
  pdf_url: string;
  created_at: string;
}

export interface Newsletter {
  id: string;
  year: number;
  title: string;
  language: 'english' | 'norwegian';
  image_url: string;
  pdf_url: string;
  published_date: string;
  created_at: string;
}