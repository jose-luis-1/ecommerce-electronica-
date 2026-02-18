
import { HeroCarousel } from '../components/common/HeroCarousel';
// Importamos iconos profesionales de Lucide React
import { 
  Truck, ShieldCheck, Zap, Star
} from 'lucide-react';


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
      
      {/* 1. HERO SECTION CON CARRUSEL */}
      <section className="relative pt-16 pb-8 overflow-hidden">
        
        {/* Fondo Tecnológico Sutil (Grid Pattern) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        {/* Orbes de luz ambiental */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse delay-1000 pointer-events-none" />

        {/* Carrusel Principal */}
        <HeroCarousel />

        {/* Sección de Descripción y CTA */}
        <div className="relative mt-12 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Tecnología premium al alcance
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Descubre nuestras ofertas destacadas. Los mejores dispositivos con los mejores precios.
            </p>

            {/* Social Proof (Prueba Social) */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-slate-400">
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
        </div>
      </section>

      {/* 4. CARACTERÍSTICAS (Trust Signals) */}
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