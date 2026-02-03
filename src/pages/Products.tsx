import { useState, useEffect, type ChangeEvent } from 'react';
import { supabase, type Product } from '../services/supabase';
import { Loading } from '../components/common/Loading';
import { CATEGORIES } from '../utils/constants';
import { Filter, SlidersHorizontal, X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addToCart } = useCart();

  // --- CARGA DE DATOS DESDE SUPABASE ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error al cargar productos de Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (loading) return <Loading fullScreen />;

  const allCategories = ['Todos', ...CATEGORIES.filter(c => c !== 'Todos')];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
 
      {/* HEADER DINÁMICO */}
      <div className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm italic">
                Mostrando {filteredProducts.length} productos reales desde la base de datos
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
 
          {/* SIDEBAR DE FILTROS */}
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
                {/* BUSCADOR */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Buscar</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="¿Qué buscas hoy?"
                      value={searchTerm}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* CATEGORÍAS DINÁMICAS */}
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
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
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

          {/* GRID DE PRODUCTOS REALES */}
          <main className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col shadow-xl">
                    <div className="relative aspect-square overflow-hidden bg-slate-800">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-\[10px] uppercase tracking-widest font-bold px-2 py-1 rounded text-white border border-white/10">
                        {product.category}
                      </span>
                    </div>
 
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{product.description}</p>
 
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                        <div className="flex flex-col">
                           <span className="text-xs text-slate-500 uppercase font-bold">Precio</span>
                           <span className="text-xl font-bold text-blue-400">
                            ${Number(product.price).toLocaleString('es-CO')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            addedToCart === product.id
                              ? 'bg-green-600 text-white'
                              : product.stock <= 0
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-white text-slate-950 hover:bg-blue-500 hover:text-white'
                          }`}
                        >
                          {addedToCart === product.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                          {product.stock <= 0 ? 'Agotado' : addedToCart === product.id ? '¡Listo!' : 'Comprar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                <span className="text-5xl mb-4">📦</span>
                <h3 className="text-xl font-bold text-white mb-2">No hay productos aquí</h3>
                <p className="text-slate-400">Agrega algo desde el panel de administración.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};