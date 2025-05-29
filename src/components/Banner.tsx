import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

interface BannerProps {
  images: { id: string; image_url: string; subtitle?: string }[];
  defaultImage?: string;
  height?: 'full' | 'large' | 'medium';
  showSubtitle?: boolean;
}

const Banner = ({ 
  images, 
  defaultImage = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  height = 'full',
  showSubtitle = false 
}: BannerProps) => {
  const heightClasses = {
    full: 'h-[90vh] min-h-[600px]',
    large: 'h-[80vh] min-h-[600px]',
    medium: 'h-[70vh] min-h-[500px]'
  };

  return (
    <div className={`relative ${heightClasses[height]}`}>
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
      >
        {images.length > 0 ? (
          images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-center bg-cover bg-no-repeat transform scale-[1.02] transition-transform duration-[2000ms] group-[.swiper-slide-active]:scale-100"
                  style={{ 
                    backgroundImage: `url(${image.image_url})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                
                {showSubtitle && image.subtitle && (
                  <div className="absolute inset-0 flex items-end justify-center px-8 pb-32">
                    <div className="max-w-3xl text-center transform transition-all duration-1000">
                      <p className="text-lg md:text-xl lg:text-2xl text-white max-w-2xl mx-auto leading-relaxed">
                        {image.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="relative h-full">
              <div 
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${defaultImage})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default Banner;