import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '../components/common/Button';
import { SHIPPING_COST } from '../utils/constants';
// Iconos profesionales
import { 
  Trash2, Plus, Minus, ShoppingCart, 
  ArrowRight, CreditCard, PackageOpen 
} from 'lucide-react';
import type { FC } from 'react';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  // --- ESTADO VACÍO (Empty State) ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
        {/* Efecto de fondo sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-2xl shadow-purple-900/10">
            <ShoppingCart className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Tu carrito está vacío</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Parece que aún no has descubierto nuestros productos. ¡Es hora de explorar!
          </p>
          <Link to="/products">
            <Button 
              size="lg"
              className=" border-slate-700 text-white hover:bg-slate-800  font-bold px-8 rounded-full shadow-lg shadow-white/10"
            >
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // --- CARRITO CON PRODUCTOS ---
  return (
    <div className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <ShoppingBagIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Carrito de Compras</h1>
          <span className="text-slate-500 text-lg font-medium ml-2">
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80"
              >
                {/* Imagen del producto */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info del producto */}
                <div className="flex-1 text-center sm:text-left w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-purple-400 font-medium bg-purple-500/10 px-2 py-0.5 rounded inline-block">
                        {item.category}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-white tracking-tight">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Controles inferiores */}
                  <div className="flex items-center justify-between mt-6">
                    {/* Selector de Cantidad */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Resumen (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6 text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    Envío 
                    {shipping === 0 && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold uppercase">Gratis</span>}
                  </span>
                  <span className="font-medium text-white">{formatPrice(shipping)}</span>
                </div>
                
                <div className="h-px bg-slate-700/50 my-4" />
                
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      {formatPrice(total)}
                    </span>
                    <span className="text-xs text-slate-500">Impuestos incluidos</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 flex justify-center items-center gap-2"
                >
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Link to="/products" className="block">
                  <Button 
                    fullWidth 
                    className="bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-3 rounded-xl"
                  >
                    Seguir Comprando
                  </Button>
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex justify-center gap-4 text-slate-600">
                 <PackageOpen className="w-5 h-5" />
                 <span className="text-xs">Garantía de devolución 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pequeño helper icon por si no está importado arriba
const ShoppingBagIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);