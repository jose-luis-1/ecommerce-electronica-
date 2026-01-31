export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre nosotros */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TechStore
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Tu tienda de tecnología confiable. Los mejores productos electrónicos al mejor precio.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Contacto</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">📧</span>
                <span>joseluisagamezlopez@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">📱</span>
                <span>+57 301 461 0269</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">📍</span>
                <span>Medellín, Antioquia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} <span className="text-slate-200 font-semibold">TechStore</span>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};