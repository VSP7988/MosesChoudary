import React, { useState, useEffect } from 'react';
import { Heart, Users, Coffee, Stethoscope, Bed, Calendar, Music, Book, Smile, ArrowRight, Activity, GraduationCap } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ChildrensHomeBanner {
  id: string;
  image_url: string;
}

interface ChildrensHomeStory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  order_position: number;
}

const ChildrensHome = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<ChildrensHomeBanner[]>([]);
  const [stories, setStories] = useState<ChildrensHomeStory[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch banners
      const { data: bannersData } = await supabase
        .from('childrens_home_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (bannersData) setBanners(bannersData);

      // Fetch stories
      const { data: storiesData } = await supabase
        .from('childrens_home_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (storiesData) setStories(storiesData);

      // Fetch gallery images
      const { data: galleryData } = await supabase
        .from('childrens_home_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryData) setGalleryImages(galleryData);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('childrens_home_testimonials')
        .select('*')
        .order('order_position', { ascending: true });

      if (testimonialsData) setTestimonials(testimonialsData);
    };

    fetchData();
  }, []);

  const services = [
    {
      icon: <GraduationCap className="w-8 h-8 text-orange-600" />,
      title: "Career Guidance",
      description: "Along with education, we guide children to pursue other areas of interest."
    },
    {
      icon: <Book className="w-8 h-8 text-orange-600" />,
      title: "Education",
      description: "School fees, uniforms, books and career counseling is provided."
    },
    {
      icon: <Activity className="w-8 h-8 text-orange-600" />,
      title: "Recreation",
      description: "Games, picnics, and tours are planned every year."
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-orange-600" />,
      title: "Medical",
      description: "All Medical needs are met, no pre-medical condition Children are admitted in the home."
    },
    {
      icon: <Coffee className="w-8 h-8 text-orange-600" />,
      title: "Food",
      description: "Nutritious Food"
    },
    {
      icon: <Bed className="w-8 h-8 text-orange-600" />,
      title: "Shelter",
      description: "A bed and a place for shelving things."
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
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)` }}
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
              <div className="text-4xl font-bold mb-2">275+</div>
              <div className="text-white/80">Children Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">40</div>
              <div className="text-white/80">Dedicated Staff</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-white/80">Education Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">41</div>
              <div className="text-white/80">Years of Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What We Provide</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive care program ensures every child receives the support they need to thrive.
            </p>
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

      {/* Success Stories Section */}
      <div className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inspiring journeys of transformation and achievement from our children.
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            slidesPerView={1}
            spaceBetween={32}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {stories.map((story) => (
              <SwiperSlide key={story.id}>
                <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
                  Your support can help provide education, nutrition, and care for children in need. Every contribution makes a difference.
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
                    Sponsor a Child's Education
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

export default ChildrensHome;