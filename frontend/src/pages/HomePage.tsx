// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {  ShoppingBag, Award, PencilRuler } from 'lucide-react';
// import api from '../services/api';
import Button from '../components/Button';
import HeroCarousel from '../components/HeroCarousel';

const HomePage: React.FC = () => {
  const categories = [
    {
      name: 'T-shirts',
      image: 'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/t-shirts',
      description: 'Custom designed t-shirts for any occasion'
    },
    {
      name: 'Bags',
      image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/bags',
      description: 'Stylish and durable custom bags'
    },
    {
      name: 'Awards',
      image: 'https://images.pexels.com/photos/6332747/pexels-photo-6332747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/awards',
      description: 'Personalized awards and trophies'
    },
    {
      name: 'Bottles',
      image: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/bottles',
      description: 'Custom water bottles and drinkware'
    },
    {
      name: 'Packaging',
      image: 'https://images.pexels.com/photos/7319097/pexels-photo-7319097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/packaging',
      description: 'Branded packaging solutions'
    },
    {
      name: 'Photo Gifts',
      image: 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/photo-gifts',
      description: 'Personalized photo gifts and keepsakes'
    },
    {
      name: 'Stickers',
      image: 'https://images.pexels.com/photos/5433010/pexels-photo-5433010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/stickers',
      description: 'Custom stickers and labels'
    },
    {
      name: 'ID Cards',
      image: 'https://images.pexels.com/photos/6120214/pexels-photo-6120214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/id-cards',
      description: 'Professional ID cards and badges'
    },
    {
      name: 'Banners',
      image: 'https://images.pexels.com/photos/7319179/pexels-photo-7319179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/products/banners',
      description: 'Custom banners for any event'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      quote: 'The custom t-shirts I ordered for my company event were perfect! The quality exceeded my expectations and the design process was so easy.',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Event Planner',
      quote: 'I was able to create custom trophies for our sports tournament that looked professional and high-end. Will definitely be ordering again!',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      quote: 'The branded merchandise we ordered helped our product launch stand out. The design tool made it easy to get exactly what we wanted.',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* How It Works Section */}
      <section className="py-16 bg-smoke">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine mb-4">How It Works</h2>
            <p className="text-lg text-wine/80 max-w-2xl mx-auto">
              Creating your custom products is simple with our easy 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-wine/10 text-wine rounded-full mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-wine">1. Choose a Product</h3>
              <p className="text-wine/80">
                Browse our catalog and select the perfect base product for your design.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-wine/10 text-wine rounded-full mb-4">
                <PencilRuler size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-wine">2. Upload Your Design</h3>
              <p className="text-wine/80">
                Upload your artwork or design and preview how it will look on your chosen product.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-wine/10 text-wine rounded-full mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-wine">3. Place Your Order</h3>
              <p className="text-wine/80">
                Check out securely and we'll handle production and shipping of your custom items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine mb-4">Popular Categories</h2>
            <p className="text-lg text-wine/80 max-w-2xl mx-auto">
              Explore our range of customizable products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div 
                key={category.path}
                className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-wine/90 via-wine/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-smoke mb-2">{category.name}</h3>
                  <p className="text-smoke/90 mb-4">{category.description}</p>
                  <Link to={category.path}>
                    <Button 
                      variant="secondary"
                      className="bg-smoke text-wine hover:bg-smoke/90 transition-colors"
                    >
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-wine mb-2">Trusted By Over 350 Large Enterprises</h2>
            <p className="text-wine text-lg">For their Printing, Signage, and Gifting needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center justify-items-center mb-10">
            {/* Company Logos */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Facebook_f_Logo_%282019%29.svg/1200px-Facebook_f_Logo_%282019%29.svg.png" 
                alt="Facebook" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" 
                alt="Microsoft" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" 
                alt="Google" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" 
                alt="Paytm" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/2048px-Uber_App_Icon.svg.png" 
                alt="Uber" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
            
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" 
                alt="Zaalima" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" 
                alt="Amazon" className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all" />
          </div>
          
          <div className="text-center">
            <Button  size="lg" className="bg-brand-wine hover:bg-opacity-90">
              <Link to="/register">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-16 bg-smoke">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine mb-4">What Our Customers Say</h2>
            <p className="text-lg text-wine/80 max-w-2xl mx-auto">
              Hear from customers who have brought their designs to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-wine">{testimonial.name}</h4>
                    <p className="text-sm text-wine/70">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-wine/80 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-wine">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-wine text-smoke">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Custom Products?</h2>
          <p className="text-xl text-smoke/90 mb-8 max-w-2xl mx-auto">
            Start designing today and bring your ideas to life with our high-quality customizable products.
          </p>
          <Link to="/products">
            <Button variant="secondary" size="lg" className="bg-smoke text-wine hover:bg-smoke/90">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;