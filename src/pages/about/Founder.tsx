import React, { useState, useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import YouTube from 'react-youtube';
import { supabase } from '../../lib/supabase';

interface FounderHeroVideo {
  video_id: string;
}

interface FounderGalleryImage {
  id: string;
  image_url: string;
}

interface FounderContent {
  title: string;
  content: string;
}

const Founder = () => {
  const [heroVideo, setHeroVideo] = useState<FounderHeroVideo | null>(null);
  const [galleryImages, setGalleryImages] = useState<FounderGalleryImage[]>([]);
  const [content, setContent] = useState<FounderContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch hero video
      const { data: videoData } = await supabase
        .from('founder_hero_video')
        .select('video_id')
        .single();

      if (videoData) {
        setHeroVideo(videoData);
      }

      // Fetch gallery images
      const { data: imagesData } = await supabase
        .from('founder_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (imagesData) {
        setGalleryImages(imagesData);
      }

      // Fetch content
      const { data: contentData } = await supabase
        .from('founder_content')
        .select('*')
        .single();

      if (contentData) {
        setContent(contentData);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[90vh] min-h-[600px] bg-black">
        <div className="absolute inset-0">
          {heroVideo ? (
            <YouTube
              videoId={heroVideo.video_id}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  loop: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  playsinline: 1,
                  modestbranding: 1,
                },
              }}
              className="w-full h-full"
              onEnd={(e) => e.target.playVideo()}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-900 to-black" />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {content && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
                  {content.title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto" />
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div 
                  className="prose max-w-none text-gray-600 leading-relaxed founder-content"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <PhotoProvider>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryImages.map((image) => (
                  <PhotoView key={image.id} src={image.image_url}>
                    <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                      <img
                        src={image.image_url}
                        alt="Gallery"
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </PhotoView>
                ))}
              </div>
            </PhotoProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Founder;