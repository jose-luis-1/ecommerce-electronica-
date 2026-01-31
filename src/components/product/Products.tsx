import { useState, useEffect } from 'react';
import type { Product } from '../../services/supabase';
// import { ProductGrid } from './ProductGrid'; 
import { Loading } from '../common/Loading';
import { CATEGORIES } from '../../utils/constants';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

// ... (MANTÉN TUS DATOS DE MOCK_PRODUCTS IGUAL QUE ANTES) ...
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'El último modelo de Apple con chip A17 Pro',
    price: 4500000,
    category: 'Teléfonos',
    image_url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop',
    stock: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'AirPods Pro 2',
    description: 'Audífonos con cancelación de ruido activa',
    price: 950000,
    category: 'Audífonos',
    image_url: 'https://images.unsplash.com/photo-1629367494173-c78a56567877?w=400&h=400&fit=crop',
    stock: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Apple Watch Series 9',
    description: 'Reloj inteligente con pantalla siempre activa',
    price: 1850000,
    category: 'Relojes Inteligentes',
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
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
];

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
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

  const allCategories = ['Todos', ...CATEGORIES.filter(c => c !== 'Todos')];

  return (
    // CAMBIO 1 (CRÍTICO): Aumentamos a 'pt-36' (aprox 144px). 
    // Esto asegura que el contenido empiece MUY abajo del logo.
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-36">
      
      {/* HEADER STICKY (Buscador) */}
      {/* CAMBIO 2: 'top-28'. Al hacer scroll, se pegará lejos del techo, evitando el Navbar. */}
      <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-28 z-30 transition-all shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Título */}
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Catálogo</h1>
              <p className="text-slate-400 text-sm mt-1">
                {filteredProducts.length} productos disponibles
              </p>
            </div>

            {/* Barra de Búsqueda */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Botón Filtros Móvil */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR DE CATEGORÍAS */}
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

              {/* Ajustado sticky del sidebar a top-48 */}
              <div className="sticky top-48 space-y-6">
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
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col">
                  {/* Imagen */}
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
                  
                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        ${new Intl.NumberFormat('es-CO').format(product.price)}
                      </span>
                      <button className="px-4 py-2 rounded-lg bg-white text-slate-950 text-sm font-bold hover:bg-slate-200 transition-colors">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No se encontraron productos.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};