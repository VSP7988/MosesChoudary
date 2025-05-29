import React, { useState, useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FileDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VedapatasalaBanner {
  id: string;
  image_url: string;
}

interface VedapatasalaContent {
  id: string;
  title: string;
  content: string;
  pdf_url?: string;
}

interface VedapatasalaGalleryImage {
  id: string;
  image_url: string;
}

const VedaPatasala = () => {
  const [banners, setBanners] = useState<VedapatasalaBanner[]>([]);
  const [content, setContent] = useState<VedapatasalaContent | null>(null);
  const [galleryImages, setGalleryImages] = useState<VedapatasalaGalleryImage[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch banners
      const { data: bannersData } = await supabase
        .from('vedapatasala_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (bannersData) setBanners(bannersData);

      // Fetch content
      const { data: contentData } = await supabase
        .from('vedapatasala_content')
        .select('*')
        .single();

      if (contentData) setContent(contentData);

      // Fetch gallery images
      const { data: galleryData } = await supabase
        .from('vedapatasala_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryData) setGalleryImages(galleryData);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} w-3 h-3 inline-block mx-2 rounded-full bg-white/50 opacity-70 transition-all cursor-pointer"></span>`;
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect="fade"
          loop={true}
          speed={1000}
          className="relative h-[90vh] min-h-[600px] [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination-bullet]:!opacity-50 [&_.swiper-pagination-bullet-active]:!opacity-100"
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        >
          {banners.length > 0 ? (
            banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div
                  className="h-full bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${banner.image_url})` }}
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div
                className="h-full bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)` }}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Content Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {content && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
                    {content.title}
                  </h2>
                  {content.pdf_url && (
                    <a
                      href={content.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <FileDown className="w-5 h-5 mr-2" />
                      Download PDF
                    </a>
                  )}
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mt-6" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

export default VedaPatasala;