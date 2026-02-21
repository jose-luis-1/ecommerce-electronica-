import type { MouseEvent } from "react";
import type { Product } from "../../services/supabase";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import { useProductDetail } from "../../context/ProductDetailContext";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { openModal } = useProductDetail();

  const discountedPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita que el click dispare otros eventos del padre
    addToCart(product);
  };

  const handleOpenDetail = () => {
    console.log("👉 Intentando abrir modal para:", product.name);
    openModal(product);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-slate-700">

      {/* IMAGEN (Click para abrir modal) */}
      <div 
        className="relative bg-slate-800 aspect-square overflow-hidden cursor-pointer"
        onClick={handleOpenDetail}
      >
        <img
          src={product.image_url || "https://via.placeholder.com/400x400?text=Producto"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col p-4 gap-3 flex-1">
        <h3
          onClick={handleOpenDetail}
          className="text-white font-bold cursor-pointer hover:text-blue-400 transition-colors line-clamp-1"
        >
          {product.name}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
          {product.description || "Producto de calidad premium disponible en TechStore."}
        </p>

        {/* PRECIO */}
        <div className="mt-2">
          {product.discount && product.discount > 0 ? (
            <div className="flex flex-col">
              <span className="text-xs line-through text-slate-500">
                {formatPrice(product.price)}
              </span>
              <p className="text-xl font-bold text-blue-400">
                {formatPrice(discountedPrice)}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-blue-400">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* BOTONES */}
        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={handleOpenDetail}
            className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl hover:bg-slate-700 transition-colors text-sm font-semibold"
          >
            Detalles
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-sm ${
              product.stock <= 0
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/20"
            }`}
          >
            {product.stock <= 0 ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};