import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: string[];
}

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortOption, setSortOption] = useState('');

  const demoProducts: Product[] = [
    // T-shirts
    {
      id: 't1',
      name: 'Classic Cotton T-Shirt',
      description: 'Premium quality cotton t-shirt perfect for everyday wear',
      price: 24.99,
      image: 'https://assets.lummi.ai/assets/QmWq23EDQbjDEdzJ1hcxjuE463jhDUM2P7hkwjN2V7dxgS?auto=format&w=1500',
      category: 't-shirts',
      variants: ['S', 'M', 'L', 'XL']
    },
    {
      id: 't2',
      name: 'Performance Athletic Tees',
      description: 'Moisture-wicking fabric ideal for sports and workouts',
      price: 29.99,
      image: 'https://assets.lummi.ai/assets/QmPyAmtgyGX9ssb2XKtyKcgfiJ3wEBh7UD9UHR38rWHFfN?auto=format&w=1500',
      category: 't-shirts',
      variants: ['S', 'M', 'L', 'XL']
    },
    {
      id: 't3',
      name: 'Vintage Graphic T-Shirt',
      description: 'Retro-inspired design on soft cotton blend',
      price: 27.99,
      image: 'https://www.lummi.ai/api/pro/image/452f9632-690e-40d2-a7cd-1b6d8c783e02?asset=original&cb=SRHB1h&auto=format&w=1500',
      category: 't-shirts',
      variants: ['S', 'M', 'L', 'XL']
    },
    // Add 17 more t-shirts...

    // Bags
    {
      id: 'b1',
      name: 'Canvas Tote Bag',
      description: 'Durable canvas tote perfect for shopping and daily use',
      price: 19.99,
      image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg',
      category: 'bags',
      variants: ['One Size']
    },
    {
      id: 'b2',
      name: 'Premium Leather Messenger',
      description: 'Handcrafted leather messenger bag for professionals',
      price: 89.99,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      category: 'bags',
      variants: ['One Size']
    },
    {
      id: 'b3',
      name: 'Eco-Friendly Shopping Bag',
      description: 'Sustainable and reusable shopping bag',
      price: 14.99,
      image: 'https://images.pexels.com/photos/5706040/pexels-photo-5706040.jpeg',
      category: 'bags',
      variants: ['One Size']
    },
    // Add 17 more bags...

    // Awards
    {
      id: 'a1',
      name: 'Crystal Excellence Trophy',
      description: 'Elegant crystal award for outstanding achievement',
      price: 79.99,
      image: 'https://images.pexels.com/photos/6332747/pexels-photo-6332747.jpeg',
      category: 'awards',
      variants: ['Standard']
    },
    {
      id: 'a2',
      name: 'Gold Achievement Medal',
      description: 'Premium metal medal with customizable engraving',
      price: 34.99,
      image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
      category: 'awards',
      variants: ['Standard']
    },
    {
      id: 'a3',
      name: 'Corporate Recognition Plaque',
      description: 'Professional wooden plaque with metal finish',
      price: 59.99,
      image: 'https://images.pexels.com/photos/6332739/pexels-photo-6332739.jpeg',
      category: 'awards',
      variants: ['Standard']
    },
    // Add 17 more awards...

    // Bottles
    {
      id: 'bt1',
      name: 'Stainless Steel Water Bottle',
      description: 'Double-walled insulated bottle for hot and cold drinks',
      price: 24.99,
      image: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg',
      category: 'bottles',
      variants: ['500ml', '750ml', '1L']
    },
    {
      id: 'bt2',
      name: 'Sports Squeeze Bottle',
      description: 'Easy-squeeze bottle perfect for athletes',
      price: 12.99,
      image: 'https://images.pexels.com/photos/2885578/pexels-photo-2885578.jpeg',
      category: 'bottles',
      variants: ['500ml', '750ml']
    },
    {
      id: 'bt3',
      name: 'Glass Infuser Bottle',
      description: 'Glass bottle with fruit infuser basket',
      price: 29.99,
      image: 'https://images.pexels.com/photos/1638349/pexels-photo-1638349.jpeg',
      category: 'bottles',
      variants: ['500ml', '750ml']
    },
    // Add 17 more bottles...

    // Continue with similar patterns for other categories...
  ];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const filteredProducts = demoProducts
    .filter(product => 
      (!category || product.category === category) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortOption === 'price-asc') {
        return a.price - b.price;
      } else if (sortOption === 'price-desc') {
        return b.price - a.price;
      } else if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

  const categories = [
    { name: 'All Products', path: '/products' },
    { name: 'T-shirts', path: '/products/t-shirts' },
    { name: 'Bags', path: '/products/bags' },
    { name: 'Awards', path: '/products/awards' },
    { name: 'Bottles', path: '/products/bottles' },
    { name: 'Packaging', path: '/products/packaging' },
    { name: 'Photo Gifts', path: '/products/photo-gifts' },
    { name: 'Stickers', path: '/products/stickers' },
    { name: 'ID Cards', path: '/products/id-cards' },
    { name: 'Banners', path: '/products/banners' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)}` 
            : 'All Products'}
        </h1>
        <p className="text-gray-600">
          Choose from our range of high-quality customizable products
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <a
                    key={cat.path}
                    href={cat.path}
                    className={`block py-1 px-2 rounded-md text-sm ${
                      (category === undefined && cat.name === 'All Products') ||
                      (category && cat.path.includes(category))
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between">
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilters}
              className="flex items-center bg-white rounded-md shadow px-4 py-2 text-gray-700"
            >
              <Filter size={16} className="mr-2" />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden bg-white rounded-lg shadow-md p-4 mb-4">
              {/* Mobile filters content */}
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  //@ts-ignore
                  variants={product.variants}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No matching products</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;