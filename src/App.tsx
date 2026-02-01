import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            {/* Contenedor principal con el fondo oscuro unificado */}
            <div className="flex flex-col min-h-screen bg-slate-950">
              <Navbar />
              
              {/* Este 'padding-top' (pt) es el que evita que el Navbar tape el contenido */}
              <main className="flex-grow pt-20 md:pt-24">
                <AppRoutes />
              </main>
              
              <Footer />
            </div>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;