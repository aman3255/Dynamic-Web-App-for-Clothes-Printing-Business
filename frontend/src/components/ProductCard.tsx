import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCart } from '../contexts/CartContext';
import Button from './Button';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  category,
  variants,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(variants?.[0] || '');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Validate variant selection if variants exist
    if (variants && variants.length > 0 && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    const cartItem = {
      id: uuidv4(),
      productId: id,
      name,
      price,
      quantity: 1,
      image,
      variant: selectedVariant,
    };

    addToCart(cartItem);
    toast.success('Added to cart!');
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="mb-1">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
              {category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold text-blue-600">${price.toFixed(2)}</span>
          </div>
        </div>
      </Link>

      {variants && variants.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {variants.map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-2 py-1 text-sm rounded ${
                  selectedVariant === variant
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 pt-0">
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddToCart}
          className="flex items-center justify-center"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;