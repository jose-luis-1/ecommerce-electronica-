import { BrowserRouter } from "react-router-dom";
import { ProductDetailProvider } from "./context/ProductDetailContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { SearchProvider } from "./context/SearchContext";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./routes/AppRoutes";
import { ProductDetailModal } from "./components/product/ProductDetailModal";

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <ProductDetailProvider>
                
                <div className="flex flex-col min-h-screen bg-slate-950">
                  <Navbar />

                  <main className="flex-grow pt-32 md:pt-20">
                    <AppRoutes />
                  </main>

                  <Footer />

                  {/* ✅ Se renderiza UNA sola vez aquí */}
                  <ProductDetailModal />
                </div>

              </ProductDetailProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;