import React, { useState } from 'react';
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
      name: 'Glory Arc Relaxed Fit T-Shirt - 100% Cotton',
      description: 'Premium quality cotton t-shirt perfect for everyday wear',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1627225793904-a2f900a6e4cf?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 't-shirts',
      variants: ['S', 'M', 'L', 'XL']
    },
    {
      id: 't1',
      name: 'Chase Onyx Heavy Weight Oversized Fit T-Shirt',
      description: 'Premium quality cotton t-shirt perfect for everyday wear',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1589902860314-e910697dea18?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 't-shirts',
      variants: ['S', 'M', 'L', 'XL']
    },
    {
      id: 't1',
      name: 'Chase Black Distressed Heavy Weight Oversized Fit T-Shirt',
      description: 'Premium quality cotton t-shirt perfect for everyday wear',
      price: 24.99,
      image: 'https://images.unsplash.com/flagged/photo-1556293467-7acc070563ee?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 't-shirts',
      variants: ['S', 'M', 'L', 'XL']
    },
    // Bags
    {
      id: 'b1',
      name: 'Eco-Friendly Tote Bag',
      description: 'Stylish and durable tote bag made from recycled materials',
      price: 19.99,
      image: 'https://plus.unsplash.com/premium_photo-1737180621286-c2250ccce178?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'bags',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'b2',
      name: 'Canvas Backpack',
      description: 'Spacious canvas backpack for all your adventures',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1622560482357-789dc8a50923?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'bags',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'b3',
      name: 'Leather Messenger Bag',
      description: 'Elegant leather messenger bag for professionals',
      price: 89.99,
      image: 'https://plus.unsplash.com/premium_photo-1670984076180-22a6c8f27f2b?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'bags',
      variants: ['Small', 'Medium', 'Large']
    },
    //  Awards
    {
      id: 'a1',
      name: 'Custom Engraved Trophy',
      description: 'Personalized trophy for your special achievements',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1527980473913-566fcaa9e34e?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'awards',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'a2',
      name: 'Glass Award Plaque',
      description: 'Elegant glass plaque for recognition and appreciation',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1550438655-400744b9fefc?q=80&w=3436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'awards',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'a3',
      name: 'Custom Medal with Ribbon',
      description: 'Personalized medal with custom engraving and ribbon',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1613826488249-b67eba609bed?q=80&w=3428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'awards',
      variants: ['Small', 'Medium', 'Large']
    },
    // Bottles
    {
      id: 'b1',
      name: 'Stainless Steel Water Bottle',
      description: 'Durable stainless steel water bottle with custom engraving',
      price: 24.99,
      image: 'https://plus.unsplash.com/premium_photo-1681284938505-62efa3494bf2?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'bottles',
      variants: ['500ml', '750ml', '1L']
    },
    {
      id: 'b2',
      name: 'Insulated Travel Mug',
      description: 'Keep your drinks hot or cold with this insulated travel mug',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1704324564365-3e0c351e5864?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'bottles',
      variants: ['500ml', '750ml', '1L']
    },
    {
      id: 'b3',
      name: 'Custom Sports Bottle',
      description: 'Personalized sports bottle for your active lifestyle',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1682309832701-a29a1c2c6600?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'bottles',
      variants: ['500ml', '750ml', '1L']
    },  
    // Packaging
    {
      id: 'p1',
      name: 'Custom Gift Box',
      description: 'Personalized gift box for special occasions',
      price: 39.99,
      image: 'https://plus.unsplash.com/premium_photo-1732043121338-000ee99e1804?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'packaging',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'p2',
      name: 'Eco-Friendly Packaging Tape',
      description: 'Biodegradable packaging tape for eco-conscious shipping',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1617912760717-06f3976cf18c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'packaging',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'p3',
      name: 'Custom Shipping Labels',
      description: 'Personalized shipping labels for your packages',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1567570670849-79db9c45cd9d?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'packaging',
      variants: ['Small', 'Medium', 'Large']
    },
    // Photo Gifts
    {
      id: 'pg1',
      name: 'Custom Photo Mug',
      description: 'Personalized mug with your favorite photo',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1623904156282-99690f6d30f4?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'photo-gifts',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'pg2',
      name: 'Photo Canvas Print',
      description: 'High-quality canvas print of your favorite photo',
      price: 49.99,
      image: 'https://plus.unsplash.com/premium_photo-1698362819283-8a321d8cf2ab?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'photo-gifts',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'pg3',
      name: 'Custom Photo Puzzle',
      description: 'Personalized puzzle with your favorite photo',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1737328519608-ee80fc77f72e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'photo-gifts',
      variants: ['Small', 'Medium', 'Large']
    },
    // Stickers
    {
      id: 's1',
      name: 'Custom Vinyl Stickers',
      description: 'High-quality vinyl stickers with custom designs',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1560531008-4edf566a4d97?q=80&w=3546&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'stickers',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 's2',
      name: 'Sticker Sheets',
      description: 'Sheets of custom stickers for various uses',
      price: 14.99,
      image: 'https://plus.unsplash.com/premium_photo-1725294296978-f4dda437b0f3?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'stickers',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 's3',
      name: 'Custom Bumper Stickers',
      description: 'Durable bumper stickers with custom designs',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1685920026448-e6a5529ca28e?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'stickers',
      variants: ['Small', 'Medium', 'Large']
    },
    // ID Cards
    {
      id: 'id1',
      name: 'Custom ID Badge',
      description: 'Personalized ID badge for events and organizations',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1589123078295-d06ba77a48e8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'id-cards',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'id2',
      name: 'Plastic ID Card',
      description: 'Durable plastic ID card with custom design',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1722192966983-763c33412758?q=80&w=3471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'id-cards',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'id3',
      name: 'Lanyard with ID Holder',
      description: 'Custom lanyard with ID holder for convenience',
      price: 9.99,
      image: 'https://media.istockphoto.com/id/2042672902/photo/blank-nametag-on-gray-background-copy-space.webp?s=2048x2048&w=is&k=20&c=jCcW11uOjaATxZ8nlxpYVBt3rmhdoDuB0ivZcYCzqfU=',
      category: 'id-cards',
      variants: ['Small', 'Medium', 'Large']
    },
    // Banners
    {
      id: 'b1',
      name: 'Vinyl Banner',
      description: 'Durable vinyl banner for indoor and outdoor use',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1742822050731-dc9da52dad2e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'banners',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'b2',
      name: 'Retractable Banner Stand',
      description: 'Portable retractable banner stand for events',
      price: 89.99,
      image: 'https://media.istockphoto.com/id/1175280398/vector/blue-business-roll-up-banner-abstract-roll-up-background-for-presentation-vertical-roll-up-x.jpg?s=612x612&w=0&k=20&c=GSdaDYz8sjr5rLDsZXG-4DG_dFp9tXXlONnuDvgjPQM=',
      category: 'banners',
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 'b3',
      name: 'Custom Fabric Banner',
      description: 'High-quality fabric banner for a premium look',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1669578298070-7f80b5948a59?q=80&w=3675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'banners',
      variants: ['Small', 'Medium', 'Large']
    },
    // 

    // ... (rest of the products remain the same, using 'variants' instead of 'sizes')
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
    <div className="container mx-auto px-4 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wine mb-2">
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
        <div className="w-full md:w-64 flex-shrink-0 ">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-16 z-20">
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
                        ? 'bg-wine text-white font-medium'
                        : 'text-gray-900 hover:bg-gray-100'
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