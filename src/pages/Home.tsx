
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
// Importamos iconos profesionales de Lucide React
import { 
  Smartphone, Headphones, Watch, 
  Truck, ShieldCheck, Zap, 
  ArrowRight, Star, ShoppingBag 
} from 'lucide-react';

// --- DATOS (Separados de la lógica visual) ---
const CATEGORIES = [
  { 
    id: 'phones',
    name: 'Smartphones', 
    icon: Smartphone, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'Última generación'
  },
  { 
    id: 'audio',
    name: 'Audio Pro', 
    icon: Headphones, 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    description: 'Sonido inmersivo'
  },
  { 
    id: 'wearables',
    name: 'Wearables', 
    icon: Watch, 
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Tecnología vestible'
  },
];

const FEATURES = [
  {
    icon: Truck,
    title: 'Envío Global',
    desc: 'Gratis en pedidos +$100.000',
    color: 'text-blue-400'
  },
  {
    icon: ShieldCheck,
    title: 'Garantía Extendida',
    desc: '12 meses de protección',
    color: 'text-purple-400'
  },
  {
    icon: Zap,
    title: 'Entrega Flash',
    desc: 'Recibe en 24/48 horas',
    color: 'text-amber-400'
  },
];

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      
      {/* 1. HERO SECTION PREMIUM */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        
        {/* Fondo Tecnológico Sutil (Grid Pattern) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Orbes de luz ambiental (Más suaves y difusos) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          
          {/* Badge de "Novedad" estilo Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md mb-8 shadow-xl shadow-purple-900/5 transition-transform hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-300">Colección Verano 2026</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
            El futuro de la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              tecnología es hoy.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Equipa tu vida con los dispositivos más avanzados del mercado. 
            Calidad premium, garantía oficial y soporte 24/7.
          </p>

          {/* Botones de Acción (CTAs) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products">
              <Button 
                size="lg" 
                className="group h-14 px-8 rounded-full border-slate-700 text-white hover:bg-slate-800 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Comprar Ahora
              </Button>
            </Link>
            <Link to="/products">
              <Button 
                size="lg"
                className="h-14 px-8 rounded-full bg-transparent border border-slate-700 text-white hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Ver Ofertas
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Social Proof (Prueba Social) */}
          <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-center items-center gap-8 text-slate-400">
             <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-xs text-white">
                      User
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-semibold text-white">4.9/5</span> de rating
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORÍAS (Estilo Bento Grid) */}
      <section className="py-24 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Explora por Categoría</h2>
              <p className="text-slate-400 mt-2">Encuentra exactamente lo que necesitas</p>
            </div>
            <Link to="/products" className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/products?category=${cat.id}`}
                className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 hover:bg-slate-800/50 transition-all duration-300 hover:border-slate-700`}
              >
                <div className={`absolute top-0 right-0 p-32 opacity-20 bg-gradient-to-br ${cat.id === 'phones' ? 'from-blue-600' : cat.id === 'audio' ? 'from-purple-600' : 'from-emerald-600'} to-transparent rounded-full blur-3xl group-hover:opacity-30 transition-opacity`} />
                
                <div className={`inline-flex p-3 rounded-2xl ${cat.bg} ${cat.color} mb-4`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{cat.name}</h3>
                <p className="text-sm text-slate-400">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CARACTERÍSTICAS (Trust Signals) */}
      <section className="py-16 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 justify-center md:justify-start">
                <div className={`p-3 rounded-xl bg-slate-800 ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{feat.title}</h4>
                  <p className="text-sm text-slate-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};