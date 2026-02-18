import { useState, useEffect } from 'react';
import { supabase, type Product } from '../../services/supabase';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  // --- FETCH DE PRODUCTOS CON DESCUENTO ---
  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('discount', 0) // Traer solo productos con descuento
          .order('discount', { ascending: false })
          .limit(5);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error al cargar productos promocionales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoProducts();
  }, []);

  // --- AUTOPLAY DEL CARRUSEL ---
  useEffect(() => {
    if (!autoplay || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, products.length]);

  // --- NAVEGACIÓN ---
  const goToPrevious = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToSlide = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  if (loading || products.length === 0) return null;

  const currentProduct = products[currentIndex];
  const discountedPrice = currentProduct.price * (1 - currentProduct.discount! / 100);
  const savings = currentProduct.price - discountedPrice;

  return (
    <section className="py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado compacto */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Zap className="w-7 h-7 text-yellow-400" />
            Ofertas Relámpago
          </h2>
        </div>

        {/* Carrusel Principal */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1))] pointer-events-none" />

          {/* Contenido del slide */}
          <div className="relative flex flex-col sm:flex-row gap-6 p-4 sm:p-6">
            
            {/* Imagen del producto */}
            <div className="flex items-center justify-center w-full sm:w-1/2">
              <div className="relative w-full h-56 sm:h-auto rounded-xl overflow-hidden bg-slate-800 group object-cover">
                <img
                  src={currentProduct.image_url || 'https://via.placeholder.com/400x400?text=Sin+Imagen'}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Badge de descuento grande */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold shadow-lg">
                  -{currentProduct.discount}%
                </div>

                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>

            {/* Información del producto */}
            <div className="flex flex-col justify-center w-full sm:w-1/2 p-4 sm:p-6">
              {/* Categoría */}
              <span className="inline-block bg-slate-800/50 text-slate-300 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full w-fit mb-3">
                {currentProduct.category}
              </span>

              {/* Nombre */}
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                {currentProduct.name}
              </h3>

              {/* Descripción */}
              <p className="text-slate-300 text-base mb-4 line-clamp-2">
                {currentProduct.description}
              </p>

              {/* Precios */}
              <div className="space-y-3 mb-6">
                <div className="flex items-end gap-3">
                  <span className="text-slate-400 line-through text-base">
                    ${Number(currentProduct.price).toLocaleString('es-CO')}
                  </span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    ${Number(discountedPrice).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                {/* Ahorro */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1 inline-block">
                  <p className="text-xs text-green-400 font-semibold">
                    💚 Ahorras: ${Number(savings).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-1">
                  Stock: <span className={`font-bold ${currentProduct.stock > 10 ? 'text-green-400' : currentProduct.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {currentProduct.stock} unidades
                  </span>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((currentProduct.stock / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Botón de acción */}
              <Link 
                to="/products"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center text-base shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 hover:scale-105"
              >
                Ver Oferta Completa
              </Link>
            </div>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center justify-between mt-6 px-2">
          
          {/* Botones de navegación */}
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 hover:scale-110"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicadores de puntos */}
          <div className="flex gap-1.5 items-center">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 w-6'
                    : 'bg-slate-700 w-2.5 hover:bg-slate-600'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Información */}
          <div className="text-slate-400 text-xs font-medium">
            {currentIndex + 1} / {products.length}
          </div>
        </div>

        {/* Indicador de autoplay */}
        <div className="mt-3 text-center">
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              autoplay
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700'
            }`}
          >
            {autoplay ? '▶ Autoplay' : '⏸ Pausado'}
          </button>
        </div>
      </div>
    </section>
  );
};
