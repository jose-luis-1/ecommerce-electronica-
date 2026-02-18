import { useState, useEffect,} from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, type Product } from '../services/supabase';
import { Loading } from '../components/common/Loading';
import { CATEGORIES } from '../utils/constants';
import { Filter, SlidersHorizontal, X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

export const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { searchTerm } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addToCart } = useCart();
  const showOnlyDiscounts = searchParams.get('discount') === 'true';

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
    let matchesCategory = true;
    
    if (selectedCategory === 'Todos') {
      matchesCategory = true;
    } else if (selectedCategory === 'Ofertas') {
      // Filtrar solo productos con descuento
      matchesCategory = (product.discount ?? 0) > 0;
    } else {
      // Filtrar por categoría exacta
      matchesCategory = product.category === selectedCategory;
    }
    
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDiscount = !showOnlyDiscounts || (product.discount && product.discount > 0);
    return matchesCategory && matchesSearch && matchesDiscount;
  });

  if (loading) return <Loading fullScreen />;

  const allCategories = ['Todos', 'Ofertas', ...CATEGORIES.filter(c => c !== 'Todos')];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
 
      {/* HEADER DINÁMICO */}
      <div className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {showOnlyDiscounts ? (
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Ofertas
                  </span>
                  <p className="text-slate-400 text-sm italic">
                    Mostrando {filteredProducts.length} artículos en descuento
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">
                  Mostrando {filteredProducts.length}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {showOnlyDiscounts && (
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 text-sm font-medium transition-all"
                >
                  ← Atrás
                </button>
              )}
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
            fixed top-16 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 h-[calc(100vh-64px)] overflow-y-auto md:translate-x-0 md:static md:bg-transparent md:z-0 md:w-64 md:block md:top-0 md:h-auto
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
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : category === 'Ofertas'
                              ? 'text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 border border-orange-500/30'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        {category === 'Ofertas' ? '🔥 ' : ''}{category}
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col shadow-xl">
                    <div className="relative overflow-hidden bg-slate-800">
                      <img
                        src={product.image_url || 'https://via.placeholder.com/400x400?text=Sin+Imagen'}
                        alt={product.name}
                        className="h-36 sm:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded text-white border border-white/10">
                        {product.category}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
 
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-sm sm:text-base font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-2">{product.description}</p>
 
                      <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-800">
                        <div className="flex flex-col gap-1">
                           <span className="text-xs text-slate-500 uppercase font-bold">Precio</span>
                           {product.discount && product.discount > 0 ? (
                             <div className="flex flex-col gap-1">
                               <span className="text-xs sm:text-sm text-slate-400 line-through">
                                 ${Number(product.price).toLocaleString('es-CO')}
                               </span>
                               <span className="text-base sm:text-lg font-bold text-blue-400">
                                 ${Number(product.price * (1 - product.discount / 100)).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                               </span>
                               <span className="text-xs text-orange-400 font-semibold">
                                 Ahorras: ${Number(product.price - (product.price * (1 - product.discount / 100))).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                               </span>
                             </div>
                           ) : (
                             <span className="text-base sm:text-lg font-bold text-blue-400">
                              ${Number(product.price).toLocaleString('es-CO')}
                            </span>
                           )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className={`w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            addedToCart === product.id
                              ? 'bg-blue-600 text-white'
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