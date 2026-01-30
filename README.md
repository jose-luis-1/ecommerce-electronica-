# 🛒 TechStore - E-commerce de Productos Electrónicos

E-commerce moderno desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Carrito de compras con gestión de cantidades
- ✅ Sistema de autenticación con Supabase
- ✅ Diseño responsive y moderno
- ✅ Gestión de estado con Context API
- ✅ Formularios validados
- ✅ Formato de precios en pesos colombianos (COP)

## 📁 Estructura del Proyecto

```
shoppy/
├── src/
│   ├── assets/              # Imágenes e iconos
│   ├── components/          # Componentes reutilizables
│   │   ├── common/          # Botones, Inputs, Cards, etc.
│   │   ├── layout/          # Navbar, Footer
│   │   └── product/         # ProductCard, ProductGrid
│   ├── pages/               # Páginas principales
│   ├── context/             # Context API (Auth, Cart)
│   ├── hooks/               # Custom hooks
│   ├── services/            # Configuración de Supabase
│   ├── utils/               # Funciones utilitarias
│   ├── routes/              # Configuración de rutas
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Punto de entrada
├── .env                     # Variables de entorno
├── tailwind.config.js       # Configuración de Tailwind
└── package.json
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **React Router** - Navegación
- **Supabase** - Backend as a Service (Base de datos + Auth)

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd shoppy
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 4. Configurar Supabase

#### a) Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta y un nuevo proyecto
3. Copia la URL y la Anon Key desde Settings → API

#### b) Crear las tablas en Supabase

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de items de órdenes
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('iPhone 15 Pro', 'El último modelo de Apple con chip A17 Pro', 4500000, 'Teléfonos', 'https://via.placeholder.com/400', 10),
('AirPods Pro 2', 'Audífonos con cancelación de ruido activa', 950000, 'Audífonos', 'https://via.placeholder.com/400', 15),
('Apple Watch Series 9', 'Reloj inteligente con pantalla siempre activa', 1850000, 'Relojes Inteligentes', 'https://via.placeholder.com/400', 8),
('Samsung Galaxy S24', 'Smartphone Android de gama alta', 3200000, 'Teléfonos', 'https://via.placeholder.com/400', 12);
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 🎨 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Crea el build de producción
npm run preview      # Previsualiza el build de producción
npm run lint         # Ejecuta el linter
```

## 🚀 Despliegue en Vercel

### 1. Instalar Vercel CLI (opcional)

```bash
npm install -g vercel
```

### 2. Desplegar

#### Opción A: Desde GitHub

1. Sube tu código a GitHub
2. Ve a [https://vercel.com](https://vercel.com)
3. Conecta tu repositorio
4. Agrega las variables de entorno (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
5. Haz clic en "Deploy"

#### Opción B: Desde la terminal

```bash
vercel
```

Sigue las instrucciones y agrega las variables de entorno cuando te lo pida.

## 📚 Uso de la Aplicación

### Navegación

- **Inicio (/)**: Página principal con categorías destacadas
- **Productos (/products)**: Catálogo completo con filtros
- **Carrito (/cart)**: Vista del carrito de compras
- **Login (/login)**: Iniciar sesión

### Funcionalidades Principales

#### 1. Ver Productos
- Navega a la sección de productos
- Filtra por categoría
- Busca productos por nombre
- Click en un producto para ver más detalles

#### 2. Agregar al Carrito
- Click en "Agregar" en cualquier ProductCard
- Ajusta cantidades desde el carrito
- Elimina productos si es necesario

#### 3. Proceso de Compra
- Revisa tu carrito
- Click en "Proceder al Pago"
- (Funcionalidad de checkout por implementar)

#### 4. Autenticación
- Crea una cuenta en /register
- Inicia sesión en /login
- Tu sesión se mantiene automáticamente

## 🔧 Personalización

### Cambiar Colores

Edita `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Cambia estos valores
        600: '#tu-color-aqui',
        700: '#tu-color-mas-oscuro',
      },
    },
  },
}
```

### Agregar Nuevas Páginas

1. Crea el componente en `src/pages/`
2. Agrega la ruta en `src/routes/AppRoutes.tsx`
3. Agrega el link en `src/components/layout/Navbar.tsx`

### Conectar con Backend Real

Reemplaza los MOCK_PRODUCTS en `src/pages/Products.tsx` con llamadas a Supabase:

```typescript
import { supabase } from '../services/supabase';

const { data, error } = await supabase
  .from('products')
  .select('*');
```

## 🐛 Solución de Problemas

### Error: "Missing Supabase credentials"

**Solución**: Verifica que tu archivo `.env` tenga las credenciales correctas.

### Los estilos no se aplican

**Solución**: Asegúrate de que `src/index.css` tenga las directivas de Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Error 404 en Vercel después del deploy

**Solución**: Vercel maneja las rutas SPA automáticamente. Si persiste, agrega un archivo `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 📝 Próximas Funcionalidades

- [ ] Página de detalle de producto
- [ ] Sistema de checkout completo
- [ ] Perfil de usuario con historial de compras
- [ ] Panel de administración
- [ ] Integración con pasarela de pago (Mercado Pago/Stripe)
- [ ] Sistema de reseñas y calificaciones
- [ ] Wishlist / Lista de deseos
- [ ] Notificaciones push

## 👨‍💻 Autor

Desarrollado como proyecto de aprendizaje de React.

## 📄 Licencia

MIT

---

¡Gracias por usar TechStore! Si tienes preguntas o sugerencias, no dudes en contactarme.