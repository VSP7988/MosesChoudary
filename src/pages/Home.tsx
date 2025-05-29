import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, Youtube } from 'lucide-react';
import YouTube from 'react-youtube';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import type { Banner, Event, YoutubeVideo, GalleryImage } from '../types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'react-photo-view/dist/react-photo-view.css';

const Home = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [bannersData, eventsData, videosData, imagesData] = await Promise.all([
        supabase.from('banners').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('date', { ascending: true }).limit(3),
        supabase.from('youtube_videos').select('*').limit(3),
        supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
      ]);

      if (bannersData.data) setBanners(bannersData.data);
      if (eventsData.data) setEvents(eventsData.data);
      if (videosData.data) setVideos(videosData.data);
      if (imagesData.data) setImages(imagesData.data);
    };

    fetchData();
  }, []);

  const youtubeOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0
    }
  };

  return (
    <div>
      {/* Hero Banner Section */}
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
            delay: 3000,
            disableOnInteraction: false,
          }}
          effect="fade"
          loop={true}
          speed={1000}
          className="relative h-[90vh] min-h-[600px] [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination-bullet]:!opacity-50 [&_.swiper-pagination-bullet-active]:!opacity-100"
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <div
                className="h-full bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${banner.image_url})` }}
              >
                {/* Content Container */}
                <div className="absolute inset-0 flex items-end justify-center px-8 md:px-16 lg:px-24 pb-32">
                  <div className={`max-w-3xl text-center transform transition-all duration-1000 ${
                    activeSlide === index 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}>
                    {/* Tagline */}
                    <p className="text-lg md:text-xl lg:text-2xl text-white max-w-2xl leading-relaxed">
                      {banner.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
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

      {/* Events Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
              Events
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <div className="text-center">
                      <span className="block text-orange-600 font-bold">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="block text-2xl font-bold text-gray-800">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>

          {/* View All Events Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/events')}
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 group"
            >
              <span>View All Events</span>
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3"
                alt="About Moses Choudary"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">About Moses Choudary</h2>
              <p className="text-gray-600 mb-6">
                Established in the year 1982 with a God given vision, the ministry of Maranatha Visvasa Samajam was started by Pastor Moses Choudary Gullapalli with a unique strategy to reach the unreached people groups in India in the context of their culture. With over 52 years of ministerial experience, and a heart burning for the lost, poor, and hurting. Pastor Choudary is a graduate of Lee College with B.S. in Biblical Studies, and of Church of God Theological Seminary with MA in Missiology. Today, this ministry has 140 Pastors & about 200 Churches, 3 Bible Schools training young men and women for the ministry. Three Children Homes with 275 boys & girls from orphan, poor, and needy backgrounds, an Asram caring for the widows & destitute. A Monthly Magazine in Telugu language and a Television Ministry to reach the unreached millions in the 10-40 window.
              </p>
              <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-full hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Latest Videos</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <YouTube
                    videoId={video.video_id}
                    opts={youtubeOpts}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Follow Us on YouTube Button */}
          <div className="text-center">
            <a
              href="https://www.youtube.com/channel/UCl_anQ9uGIHI9Dh061NbM3w"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 group"
            >
              <Youtube className="w-6 h-6 mr-2" />
              <span>Follow Us on YouTube</span>
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <PhotoProvider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <PhotoView key={image.id} src={image.image_url}>
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        </div>
      </section>
    </div>
  );
};

export default Home;