import { supabase } from './supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  total: number
): Promise<CreateOrderResult> => {
  try {
    // 1. Crear la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total: total,
          status: 'pendiente',
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message || 'Error al crear orden');
    }

    // 2. Crear los items de la orden
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error('Error al crear items de orden');
    }

    // 3. Actualizar stock de productos
    for (const item of cartItems) {
      const { error: stockError } = await supabase.rpc('update_stock', {
        product_id_input: item.id,
        quantity_input: item.quantity,
      });

      if (stockError) {
        console.error(`Error actualizando stock de ${item.name}:`, stockError);
        // No lanzamos error para no bloquear el proceso
      }
    }

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error: any) {
    console.error('Error en createOrder:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
};

export const generateWhatsAppMessage = (
  orderId: string,
  cartItems: CartItem[],
  total: number,
  shipping: number
): string => {
  const productsText = cartItems
    .map((item) => `• ${item.name} x${item.quantity} - $${new Intl.NumberFormat('es-CO').format(item.price * item.quantity)}`)
    .join('\n');

  const message = `
🧾 *Nueva Orden - TechStore*

📦 *Orden:* ${orderId.substring(0, 8)}
📅 *Fecha:* ${new Date().toLocaleString('es-CO')}

*Productos:*
${productsText}

💰 *Subtotal:* $${new Intl.NumberFormat('es-CO').format(total)}
🚚 *Envío:* $${new Intl.NumberFormat('es-CO').format(shipping)}
✨ *Total:* $${new Intl.NumberFormat('es-CO').format(total + shipping)}

_Por favor, confirma tu pedido para proceder con el envío._
`.trim();

  return message;
};

export const sendWhatsAppOrder = (
  phone: string,
  orderId: string,
  cartItems: CartItem[],
  total: number,
  shipping: number
) => {
  const message = generateWhatsAppMessage(orderId, cartItems, total, shipping);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};