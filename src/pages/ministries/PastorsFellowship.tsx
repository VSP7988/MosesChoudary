import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { supabase } from '../../lib/supabase';

interface Pastor {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url: string;
  order_position: number;
}

interface PastorsFellowshipContent {
  id: string;
  title: string;
  content: string;
}

interface PastorsFellowshipBanner {
  id: string;
  image_url: string;
  created_at: string;
}

const PastorsFellowship = () => {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [content, setContent] = useState<PastorsFellowshipContent | null>(null);
  const [banners, setBanners] = useState<PastorsFellowshipBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [pastorsData, contentData, bannersData] = await Promise.all([
        supabase
          .from('pastors')
          .select('*')
          .order('order_position', { ascending: true }),
        supabase
          .from('pastors_fellowship_content')
          .select('*')
          .single(),
        supabase
          .from('pastors_fellowship_banners')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (pastorsData.data) setPastors(pastorsData.data);
      if (contentData.data) setContent(contentData.data);
      if (bannersData.data) setBanners(bannersData.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px]">
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
          className="h-full [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination-bullet]:!opacity-50 [&_.swiper-pagination-bullet-active]:!opacity-100"
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
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)` }}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Content Section */}
      {content && (
        <div className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
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
          </div>
        </div>
      )}

      {/* Pastors Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Our Pastors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastors.map((pastor) => (
            <div
              key={pastor.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={pastor.image_url}
                  alt={pastor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{pastor.name}</h3>
                <p className="text-xl text-orange-600 font-medium mb-4">{pastor.title}</p>
                <p className="text-lg text-gray-600">{pastor.description}</p>
              </div>
            </div>
          ))}
        </div>

        {pastors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600">No pastors added yet</h3>
            <p className="text-xl text-gray-500">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastorsFellowship;