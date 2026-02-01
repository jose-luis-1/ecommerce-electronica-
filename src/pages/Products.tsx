import { useState, useEffect, type ChangeEvent } from 'react';
import type { Product } from '../services/supabase';
import { Loading } from '../components/common/Loading';
import { CATEGORIES } from '../utils/constants';
import { Filter, SlidersHorizontal, X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// --- MOCK DATA ---
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
  const [showFilters, setShowFilters] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 800);
  }, []);

  // Cuando se agrega un producto, mostrar confirmación por 1.5 segundos
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

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

  const allCategories = ['Todos', ...CATEGORIES.filter(c => c !== 'Todos')];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* HEADER */}
      <div className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm">
                {filteredProducts.length} productos
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className={`
            fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:static md:bg-transparent md:z-0 md:w-64 md:block
            ${showFilters ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="p-6 md:p-0 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h2 className="text-xl font-bold text-white">Filtros</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 text-slate-400">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="sticky top-24 space-y-8">
                {/* BÚSQUEDA */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Buscar
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CATEGORÍAS */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <Filter className="h-4 w-4" /> Categorías
                  </h3>
                  <div className="space-y-2">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RANGO DE PRECIO */}
                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Rango de Precio
                  </h3>
                  <div className="px-2">
                    <input 
                      type="range" 
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>$0</span>
                      <span>$5M+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <main className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-slate-800">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-white border border-slate-700">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                          ${new Intl.NumberFormat('es-CO').format(product.price)}
                        </span>

                        {/* BOTÓN AGREGAR AL CARRITO */}
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                            addedToCart === product.id
                              ? 'bg-green-600 text-white'
                              : 'bg-white text-slate-950 hover:bg-slate-200'
                          }`}
                        >
                          {addedToCart === product.id ? (
                            <>
                              <Check className="h-4 w-4" />
                              Agregado
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              Al Carrito
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No se encontraron productos</h3>
                <p className="text-slate-400 max-w-xs mx-auto">
                  Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.
                </p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory('Todos');}}
                  className="mt-6 text-purple-400 hover:text-purple-300 font-medium hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};