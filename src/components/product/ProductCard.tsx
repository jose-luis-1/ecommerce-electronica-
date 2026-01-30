import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../services/supabase';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Imagen */}
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x400?text=Producto'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Agotado</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Agregar
            </Button>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-600 mt-2">
              ¡Solo quedan {product.stock} unidades!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};