import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a TechStore
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Los mejores productos electrónicos al mejor precio
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Categorías Destacadas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Teléfonos', icon: '📱', color: 'bg-blue-100' },
              { name: 'Audífonos', icon: '🎧', color: 'bg-purple-100' },
              { name: 'Relojes', icon: '⌚', color: 'bg-green-100' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className={`${category.color} rounded-lg p-8 text-center hover:shadow-lg transition-shadow`}
              >
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras mayores a $100.000</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Pago Seguro</h3>
              <p className="text-gray-600">Tus datos están protegidos</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Recibe en 2-3 días hábiles</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};