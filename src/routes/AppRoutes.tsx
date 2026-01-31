import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { Cart } from '../pages/Cart';
import { Login } from '../pages/Login';
// Importamos iconos para la página 404
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- COMPONENTE AUXILIAR: SCROLL TO TOP ---
// Este "truco" hace que la página suba al inicio cada vez que cambias de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

// --- COMPONENTE: PÁGINA 404 (NOT FOUND) ---
// Diseño consistente con el resto de la app (Dark Mode)
const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 text-center px-4">
    <div className="bg-slate-900/50 p-6 rounded-full border border-slate-800 mb-6 animate-bounce">
      <FileQuestion className="w-16 h-16 text-purple-500" />
    </div>
    <h1 className="text-6xl font-bold text-white mb-2">404</h1>
    <h2 className="text-2xl font-semibold text-slate-300 mb-4">Página no encontrada</h2>
    <p className="text-slate-400 max-w-md mb-8">
      Lo sentimos, la página que estás buscando no existe o ha sido movida.
    </p>
    <Link 
      to="/" 
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver al Inicio
    </Link>
  </div>
);

// --- RUTAS PRINCIPALES ---
export const AppRoutes = () => {
  return (
    <>
      {/* Activamos el scroll automático */}
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        
        {/* Ruta Comodín (*) - Captura cualquier URL desconocida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};