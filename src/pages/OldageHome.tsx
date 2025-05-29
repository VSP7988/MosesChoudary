import React, { useState, useEffect } from 'react';
import { Heart, Users, Coffee, Stethoscope, Bed, Calendar, Music, Book, Smile, ArrowRight, Activity } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface OldageHomeBanner {
  id: string;
  image_url: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
}

interface OldageHomeContent {
  id: string;
  title: string;
  content: string;
}

const OldageHome = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<OldageHomeBanner[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [content, setContent] = useState<OldageHomeContent | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch banners
      const { data: bannersData } = await supabase
        .from('oldage_home_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (bannersData) setBanners(bannersData);

      // Fetch gallery images
      const { data: galleryData } = await supabase
        .from('oldage_home_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryData) setGalleryImages(galleryData);

      // Fetch content
      const { data: contentData } = await supabase
        .from('oldage_home_content')
        .select('*')
        .single();

      if (contentData) setContent(contentData);
    };

    fetchData();
  }, []);

  const services = [
    {
      icon: <Stethoscope className="w-8 h-8 text-orange-600" />,
      title: "Medical Care",
      description: "Medical is another essential need for this age. Since many come from economically distressed and left as adult orphans on the streets because of irregular diet, their health is usually challenging. Occasionally their extended family will take care of those needs, and frequently we takeup that challenge. We meet hospital visits, broken bones, surgeries, allergies, and countless problems. We need more support in the proviso of more medical attention."
    },
    {
      icon: <Coffee className="w-8 h-8 text-orange-600" />,
      title: "Food & Clothing",
      description: "We aimed to serve nutritious food for the elderly, includes all vegetables, meat, and dairy products. We feed every day four times, tea and snack, and give seasonal fruits to provide healthy supplements through food."
    },
    {
      icon: <Bed className="w-8 h-8 text-orange-600" />,
      title: "Shelter",
      description: "Our boarding is simple, a cot with mattress, pillow, and blankets. But, we maintain a hygiene atmosphere to give them the best place to reside and cherish new relationships. They share memories and old stories of how they lived."
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
      title: "Recreation",
      description: "A nursing home for the aged is where anyone can see more wisdom and more pain and rejection. The loved one's rejection is too hard to forget and to live by with it every day. We provide a family atmosphere to face the psychological challenges they go through. We have to build a home in the mango garden in a peaceful place to feel relaxed and live in a home away from home. Our staff will make sure that their needs are met and serve them as family. We give encouragements in multiple sessions and place some recreational events within the place to see and enjoy the time. "
    }
  ];

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
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)` }}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-white/80">Residents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">30</div>
              <div className="text-white/80">Care Staff</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Medical Care</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-white/80">Years of Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
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

      {/* Services Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">We Provide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <PhotoProvider>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

      {/* Contact Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  Your support helps us provide quality care and comfort for our elderly residents. Every contribution makes a difference.
                </p>
                <button
                  onClick={() => navigate('/donate')}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Make a Donation
                </button>
              </div>
              <div className="md:w-1/2 bg-gray-100 p-8 md:p-12">
                <h3 className="text-xl font-bold mb-4">Other Ways to Help</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <ArrowRight className="w-5 h-5 text-orange-600 mr-2" />
                    Sponsor a Resident's Care
                  </li>
                  <li className="flex items-center text-gray-700">
                    <ArrowRight className="w-5 h-5 text-orange-600 mr-2" />
                    Organize Fundraising Events
                  </li>
                  <li className="flex items-center text-gray-700">
                    <ArrowRight className="w-5 h-5 text-orange-600 mr-2" />
                    Donate Supplies and Materials
                  </li>
                  <li className="flex items-center text-gray-700">
                    <ArrowRight className="w-5 h-5 text-orange-600 mr-2" />
                    Share Our Story
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldageHome;