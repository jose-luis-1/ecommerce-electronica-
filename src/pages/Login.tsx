import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
// Usamos iconos de Lucide para dar contexto visual
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para ver contraseña
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña es demasiado corta');
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      
      {/* --- FONDO ANIMADO (Coherente con Home) --- */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700" />
        {/* Grid sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* --- TARJETA DE LOGIN --- */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header de la tarjeta */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6 transform hover:rotate-12 transition-transform duration-300">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Bienvenido
          </h2>
          <p className="mt-3 text-slate-400">
            Ingresa tus credenciales para acceder a TechStore
          </p>
        </div>

        {/* Formulario Glassmorphism */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Mensaje de Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Input Email Personalizado */}
              <div className="relative group">
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                    placeholder="nombre@ejemplo.com"
                    required
                  />
                </div>
              </div>

              {/* Input Password Personalizado */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-sm font-medium text-slate-400">Contraseña</label>
                  <a href="#" className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  {/* Botón Toggle Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Botón Submit con Estado de Carga */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Ingresar
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Footer del Formulario */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-all"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
          
          {/* Divisor Social (Opcional) */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">O continúa con</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              <span className="text-white font-medium text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              <span className="text-white font-medium text-sm">GitHub</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};