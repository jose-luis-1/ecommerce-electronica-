import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { SearchProvider } from './context/SearchContext';
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-slate-950">
                <Navbar />
                {/* Aumentamos el padding superior para despejar el área del Navbar */}
                <main className="flex-grow pt-32 md:pt-20">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;