import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'Custom Water Bottles',
    description: 'Create custom water bottles that stand out. Ideal for sports teams, corporate gifts, or personal use.',
    image: 'https://i.pinimg.com/736x/4d/59/9b/4d599baad54ab2014dd9bdd37ee2f194.jpg',
    link: '/products/bottles',
  },
  {
    title: 'Custom T-Shirts',
    description: 'Create your unique style with our premium quality custom t-shirts. Perfect for teams, events, or personal wear.',
    image: 'https://media.istockphoto.com/id/1226825218/photo/where-technology-and-craftsmanship-meet-creative-people-trying-on-stickers-with-text-while.webp?s=2048x2048&w=is&k=20&c=PECYC1i2hcT9B2hs0JUbGyQcEfRNKBKaGo1cZ9TfIDs=',
    link: '/products/t-shirts',
  },
  {
    title: 'Custom Tote Bags',
    description: 'Design eco-friendly tote bags that make a statement. Ideal for shopping, promotions, or daily use.',
    image: 'https://media.istockphoto.com/id/1224684064/photo/everything-to-market-your-business-cropped-shot-of-female-worker-posing-with-custom-shopper.webp?s=2048x2048&w=is&k=20&c=25gu8Le0W7404XgzEup21S407OH2yAurnfwPDyYt16M=',
    link: '/products/bags',
  },
  {
    title: 'Custom Awards',
    description: 'Celebrate achievements with personalized awards. Perfect for recognizing excellence and special occasions.',
    image: 'https://images.pexels.com/photos/776527/pexels-photo-776527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    link: '/products/awards',
  },
];

const HeroCarousel = () => {
  return (
    <div className="relative h-[600px]">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        loop={true}
        className="h-full"
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
      
      {/* Custom Navigation Arrows */}
      <div className=" absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-wine/70 hover:bg-wine cursor-pointer transition-colors duration-300">
        <ChevronLeft size={24} className="text-smoke" />
      </div>
      <div className=" absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-wine/70 hover:bg-wine cursor-pointer transition-colors duration-300">
        <ChevronRight size={24} className="text-smoke" />
      </div>
    </div>
  );
};

export default HeroCarousel;