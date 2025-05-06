import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';
import { useCart, CartItem } from '../contexts/CartContext';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
// import Input from '../components/Input';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  details?: string[];
  sizes?: string[];
  colors?: string[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [designUrl, setDesignUrl] = useState<string | undefined>(undefined);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.getProductById(id!);
        setProduct(response.data);
        
        // Set default selections if available
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleFileChange = (file: File | null) => {
    setDesignFile(file);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      let uploadedDesignUrl = designUrl;
      
      if (designFile) {
        setIsUploading(true);
        // Upload the design file
        try {
          const uploadResponse = await api.uploadDesign(designFile);
          uploadedDesignUrl = uploadResponse.data.url;
          setDesignUrl(uploadedDesignUrl);
        } catch (error) {
          console.error('Failed to upload design:', error);
          toast.error('Failed to upload design. Please try again.');
          setIsUploading(false);
          return;
        }
      }
      
      // Create a cart item with a unique ID
      const cartItem: CartItem = {
        id: uuidv4(), // Generate a unique ID for this cart item
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        designFile,
        designUrl: uploadedDesignUrl,
        notes
      };
      
      addToCart(cartItem);
      toast.success('Added to cart!');
      setIsUploading(false);
      
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
      setIsUploading(false);
    }
  };

  // Fallback product when API doesn't return data
  const fallbackProduct: Product = {
    id: '1',
    name: 'Premium Custom T-Shirt',
    description: 'Our premium cotton t-shirt is perfect for showcasing your unique design. Made from high-quality materials, this comfortable shirt will make your custom artwork stand out.',
    price: 24.99,
    image: 'https://images.pexels.com/photos/5699102/pexels-photo-5699102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'T-shirts',
    details: [
      '100% combed and ring-spun cotton',
      'Pre-shrunk fabric',
      'Side-seamed construction',
      'Shoulder-to-shoulder taping',
      'Available in various colors and sizes'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Red', 'Gray']
  };

  const displayProduct = product || fallbackProduct;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back to products</span>
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={displayProduct.image} 
              alt={displayProduct.name} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Details */}
          <div>
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
              {displayProduct.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayProduct.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">${displayProduct.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{displayProduct.description}</p>
              
              {displayProduct.details && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Product Details:</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {displayProduct.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Product Options */}
            <div className="space-y-6 mb-8">
              {displayProduct.sizes && displayProduct.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-sm rounded-md ${
                          selectedSize === size
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {displayProduct.colors && displayProduct.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Color:</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border text-sm rounded-md ${
                          selectedColor === color
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quantity:</h3>
                <div className="flex w-32">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-3 py-2 border border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Design */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Upload Your Design:</h3>
              <FileUpload
                onFileChange={handleFileChange}
                label=""
                accept="image/*,.pdf,.ai,.psd"
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted file types: JPG, PNG, PDF, AI, PSD (Max 10MB)
              </p>
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions:</h3>
              <textarea
                rows={3}
                placeholder="Add any special instructions or requirements for your design..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Add to Cart */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isUploading}
              isLoading={isUploading}
              className="flex items-center"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;