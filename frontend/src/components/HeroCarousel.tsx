import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Button from './Button';

const slides = [
  {
    title: 'Custom T-Shirts',
    description: 'Create your unique style with our premium quality custom t-shirts. Perfect for teams, events, or personal wear.',
    image: 'https://images.pexels.com/photos/5699102/pexels-photo-5699102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products/t-shirts',
  },
  {
    title: 'Tote Bags',
    description: 'Design eco-friendly tote bags that make a statement. Ideal for shopping, promotions, or daily use.',
    image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products/bags',
  },
  {
    title: 'Custom Awards',
    description: 'Celebrate achievements with personalized awards. Perfect for recognizing excellence and special occasions.',
    image: 'https://images.pexels.com/photos/6332747/pexels-photo-6332747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products/awards',
  },
  {
    title: 'Water Bottles',
    description: 'Create custom water bottles that stand out. Ideal for sports teams, corporate gifts, or personal use.',
    image: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products/bottles',
  },
];

const HeroCarousel: React.FC = () => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="h-[600px]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-full bg-wine">
            <div className="absolute inset-0 bg-gradient-to-r from-wine via-wine/80 to-transparent z-10" />
            <div className="container mx-auto h-full px-4 flex items-center relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-smoke">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 text-smoke/90">
                    {slide.description}
                  </p>
                  <Link to={slide.link}>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      className="bg-smoke text-wine hover:bg-smoke/90"
                    >
                      Explore Now
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-[500px] object-cover rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover md:hidden"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;