import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import type { ReactNode } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { type ChangeEvent } from "react";
// Iconos Premium
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Zap,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAdmin();
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Efecto para detectar scroll y cambiar la opacidad del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled || isMobileMenuOpen
          ? "bg-slate-950/80 backdrop-blur-md border-slate-800 py-3 shadow-lg shadow-purple-900/5"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* 1. LOGOTIPO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Tech
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Store
              </span>
            </span>
          </Link>

          {/* 2. MENÚ DESKTOP (Centro) */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink to="/" current={location.pathname === "/"}>
              Inicio
            </NavLink>
            <NavLink
              to="/products"
              current={location.pathname.startsWith("/products")}
            >
              Catálogo
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                current={location.pathname.startsWith("/admin")}
              >
                Admin
              </NavLink>
            )}
          </div>
          {/* 3. ACCIONES (Derecha) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Carrito */}
            <Link
              to="/cart"
              className="relative group p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-bold text-white items-center justify-center border-2 border-slate-950">
                    {cartCount}
                  </span>
                </span>
              )}
            </Link>

            {/* Separador vertical */}
            <div className="h-6 w-px bg-slate-800" />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full px-4 py-2 pl-10 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="max-w-[100px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-800"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-slate-950 bg-white rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* 4. BOTÓN MENÚ MÓVIL */}
          <div className="md:hidden flex items-center gap-4">
            {/* Icono carrito móvil */}
            <Link to="/cart" className="relative text-slate-300">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. MENÚ MÓVIL DESPLEGABLE */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="px-4 py-6 space-y-4">
            <MobileNavLink to="/" icon={LayoutGrid}>
              Inicio
            </MobileNavLink>
            <MobileNavLink to="/products" icon={ShoppingBag}>
              Productos
            </MobileNavLink>
            {isAdmin && (
              <MobileNavLink to="/admin" icon={ShieldCheck}>
                Admin Panel
              </MobileNavLink>
            )}

            <div className="border-t border-slate-800 my-4 pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-slate-300 text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-900 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="flex justify-center items-center py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800"
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-center items-center py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Subcomponentes para mantener el código limpio ---

type NavLinkProps = LinkProps & {
  children?: ReactNode;
  current?: boolean;
};

const NavLink = ({
  to,
  children,
  current,
  className,
  ...rest
}: NavLinkProps) => (
  <Link
    to={to}
    className={`relative text-sm font-medium transition-colors hover:text-white ${
      current ? "text-white" : "text-slate-400"
    } ${className ?? ""}`}
    {...rest}
  >
    {children}
    {/* Línea indicadora activa */}
    <span
      className={`absolute -bottom-6 left-0 w-full h-0.5 bg-purple-500 rounded-t-full transition-all duration-300 ${
        current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    />
  </Link>
);

type MobileNavLinkProps = LinkProps & {
  children?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
};

const MobileNavLink = ({
  to,
  children,
  icon: Icon,
  className,
  ...rest
}: MobileNavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-all ${className ?? ""}`}
    {...rest}
  >
    {Icon && <Icon className="w-5 h-5 text-slate-500" />}
    <span className="font-medium">{children}</span>
  </Link>
);
