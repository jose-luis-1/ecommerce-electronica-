import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
// Usamos iconos de Lucide para dar contexto visual
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import { supabase } from '../services/supabase';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para ver contraseña
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para recuperación de contraseña
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
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

  const generateRecoveryCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSendRecoveryCode = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    console.log('Send recovery code clicked for:', forgotEmail);

    if (!validateEmail(forgotEmail)) {
      setForgotError('Por favor ingresa un email válido');
      return;
    }

    setForgotLoading(true);

    try {
      // Generar código de 4 dígitos
      const code = generateRecoveryCode();
      console.log('Generated code:', code);

      // Guardar en Supabase
      const { error: insertError } = await supabase
        .from('password_recovery_codes')
        .insert([
          {
            email: forgotEmail,
            code: code,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutos
          },
        ]);

      if (insertError) throw insertError;
      console.log('Code saved to database');

      // Llamar a la Edge Function para enviar email
      try {
        const response = await supabase.functions.invoke('send-recovery-code', {
          body: {
            email: forgotEmail,
            code: code,
          },
        });
        console.log('Email function response:', response);
      } catch (emailError) {
        console.warn('Error al enviar email, pero el código fue guardado:', emailError);
      }

      setForgotStep('code');
      setForgotError('');
    } catch (err: any) {
      console.error('Error in handleSendRecoveryCode:', err);
      setForgotError(err.message || 'Error al enviar el código');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (recoveryCode.length !== 4) {
      setForgotError('El código debe tener 4 dígitos');
      return;
    }

    setForgotLoading(true);

    try {
      // Verificar código en Supabase
      const { data, error } = await supabase
        .from('password_recovery_codes')
        .select('*')
        .eq('email', forgotEmail)
        .eq('code', recoveryCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        throw new Error('Código inválido o expirado');
      }

      setForgotStep('newPassword');
      setForgotError('');
    } catch (err: any) {
      setForgotError(err.message || 'Código inválido');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (newPassword.length < 6) {
      setForgotError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Las contraseñas no coinciden');
      return;
    }

    setForgotLoading(true);

    try {
      // Invocar Edge Function para cambiar la contraseña
      const { data, error: resetError } = await supabase.functions.invoke('reset-password', {
        body: {
          email: forgotEmail,
          code: recoveryCode,
          newPassword: newPassword,
        },
      });

      if (resetError || !data?.success) {
        throw new Error(data?.error || 'Error al cambiar la contraseña');
      }

      alert('Contraseña actualizada correctamente');
      setShowForgotPassword(false);
      setForgotStep('email');
      setForgotEmail('');
      setRecoveryCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Error:', err);
      setForgotError(err.message || 'Error al cambiar la contraseña. Por favor intenta de nuevo.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    console.log('Closing forgot password modal');
    setShowForgotPassword(false);
    setForgotStep('email');
    setForgotEmail('');
    setRecoveryCode('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
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

            <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-sm font-medium text-slate-400">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Forgot password button clicked');
                      setShowForgotPassword(true);
                    }}
                    className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
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
          
        </div>

        {/* --- MODAL RECUPERACIÓN DE CONTRASEÑA --- */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={closeForgotPasswordModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 pr-8">
                {forgotStep === 'email' && 'Recuperar Contraseña'}
                {forgotStep === 'code' && 'Verificar Código'}
                {forgotStep === 'newPassword' && 'Nueva Contraseña'}
              </h2>

              {/* Mensaje de Error */}
              {forgotError && (
                <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm font-medium">
                  ⚠️ {forgotError}
                </div>
              )}

              {/* PASO 1: EMAIL */}
              {forgotStep === 'email' && (
                <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Te enviaremos un código de 4 dígitos a este correo
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar Código'
                    )}
                  </button>
                </form>
              )}

              {/* PASO 2: CÓDIGO */}
              {forgotStep === 'code' && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Código de 4 dígitos
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="0000"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-center text-2xl font-mono letter-spacing-2"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Revisa tu correo (puede estar en spam)
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading || recoveryCode.length !== 4}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar Código'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="w-full py-2 text-slate-400 hover:text-slate-300 text-sm transition-colors"
                  >
                    Volver
                  </button>
                </form>
              )}

              {/* PASO 3: NUEVA CONTRASEÑA */}
              {forgotStep === 'newPassword' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cambiando...
                      </>
                    ) : (
                      'Cambiar Contraseña'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};