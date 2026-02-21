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
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">

      {/* IMAGEN (abre modal) */}
      <div className="relative bg-slate-800">
        <img
          src={
            product.image_url ||
            "https://via.placeholder.com/400x400?text=Producto"
          }
          alt={product.name}
          onClick={() => openModal(product)}
          className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
        />
      </div>

      {/* INFO */}
      <div className="flex flex-col p-4 gap-3 flex-1">
        <h3
          onClick={() => openModal(product)}
          className="text-white font-bold cursor-pointer hover:text-blue-400 transition-colors"
        >
          {product.name}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2">
          {product.description || "Producto de calidad premium"}
        </p>

        {/* PRECIO */}
        <div>
          {product.discount && product.discount > 0 ? (
            <>
              <span className="text-sm line-through text-slate-400">
                {formatPrice(product.price)}
              </span>
              <p className="text-lg font-bold text-blue-400">
                {formatPrice(discountedPrice)}
              </p>
            </>
          ) : (
            <p className="text-lg font-bold text-blue-400">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* BOTONES */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => openModal(product)}
            className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition"
          >
            Ver detalles
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              product.stock <= 0
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-white text-slate-950 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {product.stock <= 0 ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};