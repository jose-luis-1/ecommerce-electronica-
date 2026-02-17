# 🛒 TechStore - E-commerce de Productos Electrónicos

E-commerce moderno desarrollado con React, TypeScript, Tailwind CSS y Supabase.

Estado: Deploy activo en plataforma de hosting (ej. Vercel)
Producción: Agrega aquí el enlace de tu despliegue (https://tu-dominio.com)

## 🚀 Características

- ✅ **Catálogo de productos** con filtros por categoría y búsqueda en tiempo real
- ✅ **Carrito de compras** con gestión de cantidades, eliminación de items y cálculo automático de totales
- ✅ **Sistema de autenticación** con Supabase (registro, login, logout)
- ✅ **Panel de administración** para gestión de productos y usuarios
- ✅ **Checkout y procesamiento de pedidos** con validación de formularios
- ✅ **Diseño responsive y moderno** con Tailwind CSS
- ✅ **Gestión de estado** con Context API (Auth, Cart, Search, Admin)
- ✅ **Formularios validados** con validadores personalizados
- ✅ **Formato de precios** en pesos colombianos (COP)
- ✅ **Navegación SPA** con React Router y página 404 personalizada
- ✅ **Integración con Supabase** para base de datos y autenticación

## 📁 Estructura del Proyecto

```
shoppy/
├── src/
│   ├── assets/              # Imágenes e iconos
│   │   ├── icons/           # Iconos utilizados en la app
│   │   └── images/          # Imágenes de productos y otros recursos
│   ├── components/          # Componentes reutilizables
│   │   ├── common/          # Componentes comunes
│   │   │   ├── Button.tsx   # Botón reutilizable
│   │   │   ├── Card.tsx     # Tarjeta genérica
│   │   │   ├── Input.tsx    # Campo de entrada
│   │   │   └── Loading.tsx  # Componente de carga
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── Footer.tsx   # Pie de página
│   │   │   └── Navbar.tsx   # Barra de navegación
│   │   └── product/         # Componentes relacionados con productos
│   │       ├── ProductCard.tsx  # Tarjeta individual de producto
│   │       ├── ProductGrid.tsx  # Grid de productos
│   │       └── Products.tsx     # Página de productos
│   ├── pages/               # Páginas principales de la aplicación
│   │   ├── Admin.tsx        # Panel de administración
│   │   ├── Cart.tsx         # Página del carrito
│   │   ├── Checkout.tsx     # Página de checkout
│   │   ├── Home.tsx         # Página de inicio
│   │   ├── Login.tsx        # Página de login
│   │   └── Products.tsx     # Página de listado de productos
│   ├── context/             # Context API para gestión de estado global
│   │   ├── AdminContext.tsx # Contexto para administración
│   │   ├── AuthContext.tsx  # Contexto de autenticación
│   │   ├── CartContext.tsx  # Contexto del carrito
│   │   └── SearchContext.tsx # Contexto de búsqueda
│   ├── hooks/               # Custom hooks (actualmente vacío)
│   ├── services/            # Servicios y configuraciones externas
│   │   ├── orderService.ts  # Servicio para gestión de pedidos
│   │   └── supabase.ts      # Configuración de Supabase
│   ├── utils/               # Utilidades y helpers
│   │   ├── constants.ts     # Constantes de la aplicación
│   │   ├── formatPrice.ts   # Formateo de precios
│   │   └── validators.ts    # Validadores de formularios
│   ├── routes/              # Configuración de rutas
│   │   └── AppRoutes.tsx    # Definición de rutas de la app
│   ├── App.tsx              # Componente principal de la aplicación
│   ├── App.css              # Estilos específicos de App
│   ├── index.css            # Estilos globales con Tailwind
│   └── main.tsx             # Punto de entrada de la aplicación
├── .env                     # Variables de entorno
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
├── tsconfig*.json           # Configuraciones de TypeScript
├── vite.config.ts           # Configuración de Vite
├── eslint.config.js         # Configuración de ESLint
├── vercel.json              # Configuración de despliegue en Vercel
├── package.json             # Dependencias y scripts
├── index.html               # HTML principal
└── README.md                # Este archivo
```

## 🧩 Componentes

### Componentes Comunes (`src/components/common/`)
- **Button**: Botón reutilizable con variantes (primario, secundario)
- **Card**: Tarjeta genérica para contenido estructurado
- **Input**: Campo de entrada con validación integrada
- **Loading**: Indicador de carga con spinner

### Componentes de Layout (`src/components/layout/`)
- **Navbar**: Barra de navegación con menú y carrito
- **Footer**: Pie de página con información de contacto

### Componentes de Producto (`src/components/product/`)
- **ProductCard**: Tarjeta individual mostrando imagen, nombre, precio y acciones
- **ProductGrid**: Grid responsivo para mostrar múltiples productos
- **Products**: Página completa de productos con filtros y búsqueda

### Contextos (`src/context/`)
- **AuthContext**: Gestión de autenticación y estado del usuario
- **CartContext**: Gestión del carrito de compras y cantidades
- **SearchContext**: Gestión de búsqueda y filtros de productos
- **AdminContext**: Gestión de funcionalidades administrativas

### Servicios (`src/services/`)
- **supabase.ts**: Configuración y cliente de Supabase
- **orderService.ts**: Funciones para gestión de pedidos

### Utilidades (`src/utils/`)
- **constants.ts**: Constantes de la aplicación (categorías, etc.)
- **formatPrice.ts**: Formateo de precios en COP
- **validators.ts**: Validadores para formularios

### Rutas (`src/routes/`)
- **AppRoutes.tsx**: Definición de todas las rutas de la aplicación con scroll automático y página 404

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase (Auth + Base de Datos)

## ⚙️ Configuración del Entorno

1) Instalar dependencias

```bash
npm install
```

2) Variables de entorno (.env)

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu_public_anon_key>
```

Importante: No uses nunca la clave `service_role` en el frontend.

3) Ejecutar en desarrollo

```bash
npm run dev
```

4) Build de producción

```bash
npm run build
npm run preview
```

## 🔐 Notas clave sobre Supabase

- La app cliente usa `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)` en `src/services/supabase.ts`.
- Si ves el error "Uso prohibido de clave secreta de API en el navegador":
  - Verifica que `VITE_SUPABASE_ANON_KEY` sea la clave pública (anon), no la `service_role`.
  - Revisa posibles .env.* que sobreescriban variables.
  - Reinicia el dev server tras cambiar .env.

## 🧭 Navegación y Rutas

La aplicación utiliza React Router para la navegación SPA con las siguientes rutas:

- **Inicio (/)**: Página principal con bienvenida y navegación
- **Productos (/products)**: Catálogo completo de productos con filtros y búsqueda
- **Carrito (/cart)**: Gestión del carrito de compras
- **Checkout (/checkout)**: Proceso de compra y pago
- **Login (/login)**: Autenticación de usuarios
- **Administración (/admin)**: Panel de administración (requiere permisos)
- **404 (/*)**: Página no encontrada con diseño personalizado

## 🧩 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Crea el build de producción
npm run preview      # Previsualiza el build de producción
npm run lint         # Ejecuta el linter
```

## 🧪 Consejos sobre TypeScript e importaciones

- Con `verbatimModuleSyntax` habilitado, importa tipos con `import type`:
  - `import type { ReactNode, FormEvent, MouseEvent } from 'react'`
  - `import type { Product } from '.../services/supabase'`
- Errores típicos y soluciones:
  - "X es un tipo y debe importarse mediante una importación de solo tipo": usa `import type`.
  - "Cannot find module '...'": revisa la ruta relativa desde el archivo actual.

## 🎨 Estilos

- Tailwind habilitado mediante `src/index.css` con directivas `@tailwind` y utilidades.
- Fondo global actual: color claro por defecto (`#f9fafb`) aplicado en `body`.
- Componentes con estilo:
  - `.btn-primary`, `.btn-secondary`, `.input-field`, `.card`.

## 🚀 Despliegue

- Recomendado: Vercel.
- Configuración en el panel de la plataforma:
  - Variables de entorno: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
  - Comando de build: `npm run build`
  - Directorio de salida: `dist`
- Rutas SPA: Vercel maneja rewrites automáticamente. Si se requiere, usar:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Producción: agrega aquí tu URL pública (por ejemplo, la URL que te da Vercel).

## 🐛 Solución de Problemas

- Estilos no se aplican: confirma importación de `./index.css` en `src/main.tsx`.
- Error de rutas en TS: verifica rutas relativas y nombres de exportaciones (default vs named).
- Clave Supabase inválida en navegador: usa la `anon public key` y reinicia el servidor.

## 📝 Roadmap

### ✅ Implementado
- [x] Catálogo de productos con filtros y búsqueda
- [x] Carrito de compras con gestión de cantidades
- [x] Sistema de autenticación con Supabase
- [x] Panel de administración
- [x] Checkout y procesamiento de pedidos
- [x] Diseño responsive con Tailwind CSS
- [x] Gestión de estado con Context API
- [x] Formularios validados
- [x] Formato de precios en COP
- [x] Navegación SPA con página 404

### 🔄 Pendiente
- [ ] Página de detalle de producto individual
- [ ] Perfil de usuario con historial de compras
- [ ] Pasarela de pago (Stripe/Mercado Pago)
- [ ] Wishlist y sistema de reseñas
- [ ] Notificaciones push
- [ ] Integración con APIs de envío

## 👨‍💻 Autor

Proyecto de aprendizaje de React.

## 📄 Licencia

MIT
