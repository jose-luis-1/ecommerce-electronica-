export const CATEGORIES = [
  'Todos',
  'Teléfonos',
  'Audífonos',
  'Relojes Inteligentes',
  'Tablets',
  'Monitores',
  'Accesorios',
  'Portátiles',
  'Ofertas',
  
];

export const PRICE_RANGES = [
  { label: 'Todos los precios', min: 0, max: Infinity },
  { label: 'Menos de $500.000', min: 0, max: 500000 },
  { label: '$500.000 - $1.000.000', min: 500000, max: 1000000 },
  { label: '$1.000.000 - $2.000.000', min: 1000000, max: 2000000 },
  { label: 'Más de $2.000.000', min: 2000000, max: Infinity },
];

export const SHIPPING_COST = 15000;

export const TAX_RATE = 0.19; // IVA 19%