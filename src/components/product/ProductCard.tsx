import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../services/supabase';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';

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
      <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-xl">
        
        {/* BLOQUE 1: Solo imagen con badges */}
        <div className="relative w-full overflow-hidden bg-slate-800">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x400?text=Producto'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badge Categoría */}
          <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded text-white border border-white/10">
            {product.category}
          </span>
          
          {/* Badge Descuento */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{product.discount}%
            </div>
          )}
          
          {/* Overlay agotado */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Agotado</span>
            </div>
          )}
        </div>

        {/* BLOQUE 2: Info + Botón */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 flex-1">
            {product.description || 'Producto de calidad premium'}
          </p>
          
          {/* Precios */}
          <div className="space-y-1">
            {product.discount && product.discount > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-base sm:text-lg font-bold text-blue-400">
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </span>
                <span className="text-xs text-orange-400 font-semibold">
                  Ahorras: ${Math.round(product.price - (product.price * (1 - product.discount / 100))).toLocaleString('es-CO')}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-bold text-blue-400">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock bajo */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-400 font-semibold">
              ¡Solo quedan {product.stock} unidades!
            </p>
          )}
          
          {/* Botón al final */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`mt-auto w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              product.stock <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-white text-slate-950 hover:bg-blue-500 hover:text-white'
            }`}
          >
            {product.stock <= 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </Link>
  );
};