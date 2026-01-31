# 🛒 TechStore - E-commerce de Productos Electrónicos

E-commerce moderno desarrollado con React, TypeScript, Tailwind CSS y Supabase.

Estado: Deploy activo en plataforma de hosting (ej. Vercel)
Producción: Agrega aquí el enlace de tu despliegue (https://tu-dominio.com)

## 🆕 Cambios recientes

- TypeScript
  - Activado cumplimiento estricto de importaciones de tipos (verbatimModuleSyntax).
  - Se actualizaron importaciones de solo tipo con `import type { ... } from 'react'` en:
    - src/components/common/Input.tsx (InputHTMLAttributes)
    - src/components/common/Card.tsx (ReactNode)
    - src/context/AuthContext.tsx (ReactNode y tipos de Supabase)
    - src/context/CartContext.tsx (ReactNode y Product como tipo)
    - Recomendación aplicada en otros archivos que usan tipos (FormEvent, MouseEvent, etc.).
- Importaciones y rutas
  - Corregidas rutas relativas en `src/components/product/Products.tsx`:
    - `Product` desde `../../services/supabase` (y como importación de solo tipo)
    - `ProductGrid` desde `./ProductGrid`
    - `Loading` desde `../common/Loading`
    - `CATEGORIES` desde `../../utils/constants`
- Supabase (seguridad y entorno)
  - Se documentó y ajustó el uso de la clave pública (anon) en el frontend.
  - Nota: Nunca usar `service_role` en el navegador (soluciona "Uso prohibido de clave secreta de API en el navegador").
- Estilos globales
  - Estilos restaurados a su estado original (fondo claro por defecto en `body`).
  - Wrapper de la App con `bg-gray-50` para fondo base.

## 🚀 Características

- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Carrito de compras con gestión de cantidades
- ✅ Sistema de autenticación con Supabase
- ✅ Diseño responsive y moderno
- ✅ Gestión de estado con Context API (Auth y Cart)
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

- Inicio (/)
- Productos (/products)
- Carrito (/cart)
- Login (/login)

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

- [ ] Página de detalle de producto
- [ ] Checkout
- [ ] Perfil de usuario con historial
- [ ] Panel de administración
- [ ] Pasarela de pago (Stripe/Mercado Pago)
- [ ] Wishlist y reseñas

## 👨‍💻 Autor

Proyecto de aprendizaje de React.

## 📄 Licencia

MIT
