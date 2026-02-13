import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, sendWhatsAppOrder } from '../services/orderService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';

const SHIPPING_COST = 15000;
const WHATSAPP_PHONE = '573014610269';

export const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '', // ✅ Agregado
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '', // ✅ Agregado
    phone: '',
    address: '',
    city: '',
  });

  const shipping = cartTotal > 100000 ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;

  // Redirigir si el carrito está vacío
  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '', 
      phone: '',
      address: '',
      city: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // ✅ NUEVO: Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido de 10 dígitos';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // ✅ MODIFICADO: Pasar userId como opcional y agregar email + customerInfo
      const result = await createOrder(
        user?.id || null, // null si no está logueado
        cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        formData.email, // ✅ NUEVO: email
        {
          // ✅ NUEVO: información del cliente
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes,
        }
      );

      if (!result.success || !result.orderId) {
        throw new Error(result.error || 'Error al crear la orden');
      }

      setOrderId(result.orderId);
      setOrderSuccess(true);

      // Enviar a WhatsApp
      sendWhatsAppOrder(
        WHATSAPP_PHONE,
        result.orderId,
        cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        cartTotal,
        shipping
      );

      // Limpiar carrito
      clearCart();
    } catch (error: any) {
      console.error('Error en checkout:', error);
      alert('❌ Error al procesar la orden: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Vista de éxito
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">¡Orden Creada!</h2>
          <p className="text-slate-400 mb-2">
            Tu orden <span className="text-purple-400 font-mono">#{orderId.substring(0, 8)}</span> ha sido creada exitosamente.
          </p>
          <p className="text-slate-400 mb-6">
            Se ha abierto WhatsApp para confirmar tu pedido. Si no se abrió automáticamente, contáctanos al{' '}
            <span className="text-white font-semibold">{WHATSAPP_PHONE}</span>
          </p>
          <div className="space-y-3">
            <Button fullWidth onClick={() => navigate('/products')}>
              Seguir Comprando
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver al Carrito
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Información de Entrega</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Nombre Completo *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    error={errors.name}
                  />

                  {/* ✅ NUEVO: Campo de email */}
                  <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    error={errors.email}
                  />

                  <Input
                    label="Teléfono *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="3001234567"
                    error={errors.phone}
                  />

                  <Input
                    label="Dirección de Entrega *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle 123 #45-67"
                    error={errors.address}
                  />

                  <Input
                    label="Ciudad *"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Medellín"
                    error={errors.city}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Notas Adicionales (Opcional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Ej: Entregar en la portería, etc."
                      className="input-field resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar Pedido por WhatsApp'
                )}
              </Button>
            </form>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

              {/* Productos */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-white font-semibold">
                      ${new Intl.NumberFormat('es-CO').format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>${new Intl.NumberFormat('es-CO').format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Envío:</span>
                  <span className={shipping === 0 ? 'text-green-400 font-semibold' : ''}>
                    {shipping === 0 ? 'Gratis ✓' : `$${new Intl.NumberFormat('es-CO').format(shipping)}`}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between">
                  <span className="text-white font-bold text-lg">Total:</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-lg">
                    ${new Intl.NumberFormat('es-CO').format(total)}
                  </span>
                </div>
              </div>

              {/* Info adicional */}
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-400 text-center">
                  Al confirmar, se abrirá WhatsApp para finalizar tu pedido. Nuestro equipo te contactará para coordinar el pago y envío.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};