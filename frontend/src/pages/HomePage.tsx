import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Award, PencilRuler } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.getProducts();
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'T-shirts', path: '/products/t-shirts', image: 'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Bags', path: '/products/bags', image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Awards', path: '/products/awards', image: 'https://images.pexels.com/photos/6332747/pexels-photo-6332747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Bottles', path: '/products/bottles', image: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Stickers', path: '/products/stickers', image: 'https://images.pexels.com/photos/5433010/pexels-photo-5433010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
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
      {/* Hero Section */}
      <section className="relative bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-wine/80"></div>
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-smoke">
              Design & Create Your Own Custom Products
            </h1>
            <p className="text-xl mb-8 text-smoke/90">
              Upload your designs and we'll bring them to life on high-quality customizable products.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products">
                <Button variant="secondary" size="lg" className="bg-smoke text-wine hover:bg-smoke/90">
                  Browse Products
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-smoke text-smoke hover:bg-smoke/10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-wine">Featured Products</h2>
            <Link to="/products" className="flex items-center text-wine hover:text-wine/80">
              View all products <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                  />
                ))
              ) : (
                <>
                  <ProductCard
                    id="1"
                    name="Premium Custom T-Shirt"
                    description="High-quality cotton t-shirt with your custom design"
                    price={24.99}
                    image="https://images.pexels.com/photos/5699102/pexels-photo-5699102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    category="T-shirts"
                  />
                  <ProductCard
                    id="2"
                    name="Custom Canvas Tote Bag"
                    description="Durable canvas tote bag perfect for your design"
                    price={19.99}
                    image="https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    category="Bags"
                  />
                  <ProductCard
                    id="3"
                    name="Personalized Crystal Award"
                    description="Elegant crystal award with custom engraving"
                    price={49.99}
                    image="https://images.pexels.com/photos/6332747/pexels-photo-6332747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    category="Awards"
                  />
                  <ProductCard
                    id="4"
                    name="Custom Water Bottle"
                    description="Stainless steel water bottle with your logo"
                    price={29.99}
                    image="https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    category="Bottles"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-smoke">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine mb-4">Browse Categories</h2>
            <p className="text-lg text-wine/80 max-w-2xl mx-auto">
              Explore our range of customizable products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="group relative overflow-hidden rounded-lg shadow-md aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine/80 via-wine/20 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-smoke text-xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine mb-4">What Our Customers Say</h2>
            <p className="text-lg text-wine/80 max-w-2xl mx-auto">
              Hear from customers who have brought their designs to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-smoke p-6 rounded-lg shadow-md">
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