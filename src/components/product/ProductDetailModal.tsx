import { useEffect } from 'react';
import { X, ShoppingCart, Star, Truck, RotateCw } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import { useProductDetail } from '../../context/ProductDetailContext';

export const ProductDetailModal = () => {
  const { closeModal, isOpen, selectedProduct } = useProductDetail();
  const { addToCart } = useCart();

  console.log(
    'Modal state → isOpen:',
    isOpen,
    '| product:',
    selectedProduct?.name
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeModal]);

  if (!isOpen || !selectedProduct) return null;

  const product = selectedProduct;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const savingsAmount = product.discount
    ? Math.round(product.price - discountedPrice)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
    closeModal();
  };

  return (
    <>
      {/* OVERLAY: z-50 — queda debajo del modal */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* ✅ FIX: z-[60] > z-50 del overlay | pointer-events-none en el wrapper */}
      <div className="fixed inset-0 z-[60] overflow-auto flex items-center justify-center p-4 pointer-events-none">
        
        {/* ✅ pointer-events-auto solo en el contenido del modal */}
        <div
          className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-800 max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              Detalles del Producto
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* IMAGEN */}
              <div className="flex items-center justify-center bg-slate-800 rounded-xl overflow-hidden h-80">
                <img
                  src={
                    product.image_url ||
                    'https://via.placeholder.com/400x400?text=Producto'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* INFORMACIÓN */}
              <div className="flex flex-col gap-4">

                {/* CATEGORÍA Y RATING */}
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">
                      (234 reseñas)
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {product.name}
                </h1>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {product.description ||
                    'Producto de alta calidad con los mejores materiales del mercado.'}
                </p>

                {/* PRECIOS */}
                <div className="border-t border-slate-700 pt-4">
                  {product.discount && product.discount > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">
                          -{product.discount}%
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-blue-400">
                        {formatPrice(discountedPrice)}
                      </div>
                      <div className="text-sm text-green-400 font-semibold">
                        ✓ Ahorras: $
                        {savingsAmount.toLocaleString('es-CO')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-blue-400">
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>

                {/* STOCK */}
                <div className="border-t border-slate-700 pt-4">
                  {product.stock > 0 ? (
                    <div>
                      <p className="text-sm text-slate-300 mb-2">
                        <strong>Stock disponible:</strong> {product.stock} unidades
                      </p>
                      {product.stock <= 5 && (
                        <p className="text-xs text-orange-400 font-semibold">
                          ⚠️ ¡Solo quedan {product.stock} unidades!
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-400 font-semibold">
                      ❌ Producto Agotado
                    </p>
                  )}
                </div>

                {/* BENEFICIOS */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-slate-300">
                      Envío gratis en compras superiores a $50
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RotateCw className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-slate-300">
                      Devolución sin costo dentro de 30 días
                    </span>
                  </div>
                </div>

                {/* BOTÓN AGREGAR */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-base ${
                    product.stock <= 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 active:scale-95'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock <= 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>

                {/* BOTÓN CERRAR (solo mobile) */}
                <button
                  onClick={closeModal}
                  className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors md:hidden"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* ESPECIFICACIONES */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Especificaciones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    SKU
                  </p>
                  <p className="text-white font-mono text-sm">{product.id}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Categoría
                  </p>
                  <p className="text-white">{product.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};