import { useState, useEffect } from 'react';
import type {ChangeEvent} from 'react';
import type { Product } from '../services/supabase';
import { ProductGrid } from '../components/product/ProductGrid';
import { Loading } from '../components/common/Loading';
import { CATEGORIES } from '../utils/constants';

// Productos de ejemplo (reemplazar con llamadas a Supabase)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'El último modelo de Apple con chip A17 Pro',
    price: 4500000,
    category: 'Teléfonos',
    image_url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop',
    stock: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'AirPods Pro 2',
    description: 'Audífonos con cancelación de ruido activa',
    price: 950000,
    category: 'Audífonos',
    image_url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
    stock: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Apple Watch Series 9',
    description: 'Reloj inteligente con pantalla siempre activa',
    price: 1850000,
    category: 'Relojes Inteligentes',
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
    stock: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    description: 'Smartphone Android de gama alta',
    price: 3200000,
    category: 'Teléfonos',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    stock: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    description: 'Audífonos over-ear con cancelación de ruido premium',
    price: 1250000,
    category: 'Audífonos',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    stock: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Samsung Galaxy Watch 6',
    description: 'Smartwatch con seguimiento avanzado de salud',
    price: 1100000,
    category: 'Relojes Inteligentes',
    image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
    stock: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'iPad Pro M2',
    description: 'Tablet profesional con chip M2 y pantalla Liquid Retina',
    price: 4200000,
    category: 'Tablets',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    stock: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'JBL Flip 6',
    description: 'Parlante Bluetooth portátil resistente al agua',
    price: 450000,
    category: 'Accesorios',
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 25,
    created_at: new Date().toISOString(),
  },
];
export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carga de productos
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 500);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>

      {/* Filtros */}
      <div className="mb-8 space-y-4">
        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="input-field max-w-md"
        />

        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
};