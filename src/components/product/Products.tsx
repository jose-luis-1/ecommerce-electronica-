import { useState, useEffect } from 'react';
import type { Product } from '../../services/supabase';
import { ProductGrid } from './ProductGrid';
import { Loading } from '../common/Loading';
import { CATEGORIES } from '../../utils/constants';

// Productos de ejemplo (reemplazar con llamadas a Supabase)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'El último modelo de Apple con chip A17 Pro',
    price: 4500000,
    category: 'Teléfonos',
    image_url: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro',
    stock: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'AirPods Pro 2',
    description: 'Audífonos con cancelación de ruido activa',
    price: 950000,
    category: 'Audífonos',
    image_url: 'https://via.placeholder.com/400x400?text=AirPods+Pro+2',
    stock: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Apple Watch Series 9',
    description: 'Reloj inteligente con pantalla siempre activa',
    price: 1850000,
    category: 'Relojes Inteligentes',
    image_url: 'https://via.placeholder.com/400x400?text=Apple+Watch+9',
    stock: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    description: 'Smartphone Android de gama alta',
    price: 3200000,
    category: 'Teléfonos',
    image_url: 'https://via.placeholder.com/400x400?text=Galaxy+S24',
    stock: 12,
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
          onChange={(e) => setSearchTerm(e.target.value)}
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