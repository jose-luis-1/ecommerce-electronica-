import { useState, useEffect } from 'react';
import type { Product } from '../../services/supabase';
// import { ProductGrid } from './ProductGrid'; 
import { Loading } from '../common/Loading';
import { CATEGORIES } from '../../utils/constants';
import { Search, Filter, SlidersHorizontal, X, ShoppingCart } from 'lucide-react';

const MOCK_PRODUCTS: Product[] = [];

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
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-36">
      
      {/* HEADER STICKY (Buscador) */}
      <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-28 z-30 transition-all shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-3">

            {/* Título */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">Catálogo</h1>
              <p className="text-slate-400 text-xs sm:text-sm">{filteredProducts.length} productos</p>
            </div>

            {/* Barra de Búsqueda — siempre visible, en mobile ocupa todo el ancho */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-80 group">
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
                className="md:hidden flex-shrink-0 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 transition-colors"
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* ── BLOQUE 1: Solo imagen + badges ── */}
                  <div className="relative w-full overflow-hidden bg-slate-800">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-white border border-slate-700">
                      {product.category}
                    </span>
                    {product.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded">
                        Agotado
                      </span>
                    )}
                  </div>

                  {/* ── BLOQUE 2: Info + precio + botón ── */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    {/* Precio en su propia fila */}
                    <p className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                      ${new Intl.NumberFormat('es-CO').format(product.price)}
                    </p>

                    {/* Botón en su propia fila, ancho completo */}
                    <button
                      disabled={product.stock === 0}
                      className={`w-full py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                        product.stock === 0
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-white text-slate-950 hover:bg-slate-200'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.stock === 0 ? 'Agotado' : 'Comprar'}
                    </button>
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