# Lavandería Jireh — Frontend

Plataforma completa de Lavandería Jireh que integra una **landing page pública** y un **sistema de gestión interno** para administrar pedidos, clientes, empleados, servicios y pagos, con dashboards diferenciados por rol, reportes analíticos y consulta pública del estado de pedidos.

> **Backend:** [JeancarloMejia/LavanderiaJirehBackend](https://github.com/JeancarloMejia/LavanderiaJirehBackend) — API REST con Django 5 + PostgreSQL, desplegada en [lavanderiajireh-api.onrender.com](https://lavanderiajireh-api.onrender.com)

---

## Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Comandos disponibles](#comandos-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Landing page](#landing-page)
- [Módulos del sistema](#módulos-del-sistema)
- [Roles y permisos](#roles-y-permisos)
- [Autenticación](#autenticación)
- [Endpoints del backend](#endpoints-del-backend)

---

## Características

### Landing page pública (`/`)
- **Hero section** con palabras rotativas animadas y parallax al mover el cursor
- **Sección Nosotros** con línea de tiempo y tarjeta flotante de experiencia
- **Sección Servicios** con 4 tarjetas animadas y CTA de acceso al sistema
- **Sección Características** con lista de beneficios y animaciones en scroll
- **Sección Proceso** con línea de progreso animada y pasos numerados
- **Sección Testimonios** con carrusel deslizable y avatares apilados
- **Sección Blog** con artículos en grid y fechas actualizadas
- **Footer completo** con newsletter, links rápidos y botón de acceso al sistema
- **Botones "Acceder al sistema"** en Navbar, Hero y Footer → redirigen a `/login`

### Sistema de gestión (requiere autenticación)
- **Gestión completa de pedidos** — creación, seguimiento de estados, prendas, servicios y recibos con código QR
- **CRUD de clientes** — incluyendo personas autorizadas e historial de pedidos
- **CRUD de empleados** — con asignación de roles y credenciales de acceso
- **Gestión de servicios** — catálogo configurable con precios base
- **Registro de pagos** — múltiples métodos (efectivo, tarjeta, Yape, Plin, transferencia)
- **Reportes y analytics** — ingresos diarios/mensuales, servicios más populares y distribución por estado
- **Dashboard por rol** — vista completa para administradores y recepcionistas; vista operativa simplificada para operarios
- **Consulta pública** — búsqueda de pedidos por código sin necesidad de autenticación
- **Recibo imprimible** — con desglose de IGV y código QR generado automáticamente
- **PWA** — instalable en dispositivos móviles y escritorio con caché offline

---

## Stack tecnológico

### Frontend

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 19.2 |
| Lenguaje | TypeScript | 6.0 |
| Bundler | Vite | 8.0 |
| Estilos | Tailwind CSS | 4.3 |
| Animaciones | Framer Motion | 12.x |
| Enrutamiento | React Router DOM | 7.15 |
| Estado global | Zustand | 5.0 |
| Fetching y caché | TanStack Query | 5.100 |
| Cliente HTTP | Axios | 1.16 |
| Formularios | React Hook Form | 7.76 |
| Validación | Zod | 4.4 |
| Gráficos | Recharts | 3.8 |
| Componentes base | Radix UI | varios |
| Iconos | Lucide React | 1.16 |
| Fechas | date-fns | 4.3 |
| QR | qrcode.react | 4.2 |
| PWA | vite-plugin-pwa | 1.3 |

### Backend

| Categoría | Tecnología | Versión |
|---|---|---|
| Lenguaje | Python | 3.12 |
| Framework | Django + DRF | 5.2 / 3.15 |
| Base de datos | PostgreSQL (Neon) | — |
| Autenticación | SimpleJWT | 5.3 |
| Generación PDF | ReportLab | 4.2 |
| Exportación Excel | openpyxl | 3.1 |
| Servidor | Gunicorn + WhiteNoise | — |
| Despliegue | Render.com | — |

---

## Arquitectura

```
Visitante (público)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend — React + Vite (puerto 5173)       │
│                                                          │
│  /  ──────► LandingPage (público, sin autenticación)     │
│  /login ──► Login                                        │
│  /dashboard, /pedidos, /clientes… ──► AppLayout (JWT)    │
│                                                          │
│  /api/*   ─── proxy ──────────────────────────────────► │
│  /pedido/ ─── proxy ──────────────────────────────────► │
└─────────────────────────────────────────────────────────┘
                                │  HTTPS / REST API + JWT
                                ▼
              ┌─────────────────────────────────┐
              │  Backend — Django + DRF          │
              │  lavanderiajireh-api.onrender.com │
              │  PostgreSQL en Neon (cloud)       │
              └─────────────────────────────────┘
```

En desarrollo, Vite redirige `/api` y `/pedido` al backend mediante un proxy configurado en `vite.config.ts`. En producción el frontend apunta directamente a la URL de la API mediante `VITE_API_URL`.

---

## Requisitos

- **Node.js** 18 o superior
- **Backend** corriendo localmente en `http://localhost:8000` o URL de producción

### Levantar el backend localmente

```bash
# Clonar el backend
git clone https://github.com/JeancarloMejia/LavanderiaJirehBackend.git
cd LavanderiaJirehBackend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux / macOS

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes (DATABASE_URL, SECRET_KEY...)

# Aplicar migraciones y arrancar
python manage.py migrate
python manage.py runserver
```

> El backend también está disponible en producción: `https://lavanderiajireh-api.onrender.com`

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JuanVictorFY/Lavanderia-Jireh-Frontend.git
cd Lavanderia-Jireh-Frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```env
# Desarrollo local (el proxy de Vite lo redirige automáticamente)
VITE_API_URL=http://localhost:8000

# Producción
# VITE_API_URL=https://lavanderiajireh-api.onrender.com
```

El proxy de Vite en `vite.config.ts` usa esta variable para redirigir `/api` y `/pedido` al backend, tanto en desarrollo como en otros entornos.

---

## Comandos disponibles

```bash
# Servidor de desarrollo con hot reload
npm run dev

# Build de producción (TypeScript + Vite)
npm run build

# Vista previa del build de producción
npm run preview

# Análisis estático con ESLint
npm run lint
```

---

## Estructura del proyecto

```
src/
├── assets/                      # Imágenes, SVGs y recursos estáticos
├── components/
│   ├── landing/                 # Componentes de la landing page pública
│   │   ├── Navbar.tsx           # Navbar con scroll activo y botón "Acceder al sistema"
│   │   ├── HeroSection.tsx      # Hero con parallax, palabras rotativas y CTA
│   │   ├── AboutSection.tsx     # Historia y valores con animaciones en scroll
│   │   ├── ServicesSection.tsx  # Tarjetas de servicios con hover y CTA
│   │   ├── FeaturesSection.tsx  # Beneficios con lista animada y badge flotante
│   │   ├── ProcessSection.tsx   # Proceso paso a paso con línea de progreso
│   │   ├── TestimonialsSection.tsx # Carrusel de testimonios con avatares
│   │   ├── BlogSection.tsx      # Grid de artículos del blog
│   │   └── Footer.tsx           # Footer con newsletter, links y acceso al sistema
│   ├── layout/
│   │   ├── AppLayout.tsx        # Layout protegido con sidebar responsive
│   │   └── Sidebar.tsx          # Navegación lateral filtrada por rol
│   └── ui/
│       ├── alert.tsx
│       ├── badge.tsx            # Badge genérico + EstadoBadge por estado de pedido
│       ├── button.tsx
│       ├── card.tsx
│       ├── divider.tsx
│       ├── empty-state.tsx
│       ├── input.tsx
│       ├── modal.tsx            # Modal genérico + ConfirmModal
│       ├── pagination.tsx
│       ├── select.tsx
│       ├── skeleton.tsx         # SkeletonCard y SkeletonTable
│       ├── spinner.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── hooks/
│   ├── useScrollAnimation.ts    # useInView de framer-motion para animaciones en scroll
│   ├── useClipboard.ts          # Copiar al portapapeles
│   ├── useConfirm.ts            # Modal de confirmación con estado
│   ├── useDebounce.ts           # Debounce de valores reactivos
│   ├── useFetch.ts              # Fetch básico con loading/error
│   ├── useKeyPress.ts           # Detección de teclas
│   ├── useLocalStorage.ts       # Persistencia en localStorage
│   ├── useMediaQuery.ts         # useIsMobile / useIsDesktop
│   ├── usePagination.ts         # Gestión de paginación
│   ├── useSort.ts               # Gestión de ordenamiento
│   ├── useTitle.ts              # document.title dinámico
│   └── useWindowSize.ts         # Dimensiones de ventana reactivas
├── lib/
│   ├── api.ts                   # Cliente Axios con interceptores JWT y auto-refresh
│   ├── constants.ts             # Labels de estados, métodos de pago y roles
│   └── utils.ts                 # 30+ helpers (formateo, validación, arreglos, fechas)
├── pages/
│   ├── LandingPage.tsx          # Página pública de inicio (ruta "/")
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── DashboardOperario.tsx
│   ├── Pedidos.tsx
│   ├── NuevoPedido.tsx
│   ├── PedidoDetalle.tsx
│   ├── Recibo.tsx
│   ├── ConsultaPublica.tsx
│   ├── Clientes.tsx
│   ├── ClienteDetalle.tsx
│   ├── Servicios.tsx
│   ├── Pagos.tsx
│   ├── Empleados.tsx
│   └── Reportes.tsx
├── store/
│   └── auth.ts                  # Store de sesión (Zustand + persistencia)
├── types/
│   └── index.ts                 # Interfaces y tipos globales del dominio
├── App.tsx                      # Router principal con rutas públicas y protegidas
└── main.tsx                     # Punto de entrada
```

---

## Landing page

La ruta `/` carga la **LandingPage** — completamente pública, sin necesidad de autenticación. Sirve como punto de entrada para nuevos visitantes e incluye llamadas a la acción que redirigen al sistema de gestión en `/login`.

### Secciones

| Sección | Descripción |
|---|---|
| **Navbar** | Fija, con scroll suave a cada sección y botón "Acceder al sistema" → `/login` |
| **Hero** | Fondo primario con burbujas animadas, palabras rotativas y parallax al cursor |
| **Nosotros** | Historia de la empresa, 15+ años de experiencia y lista de beneficios |
| **Servicios** | 4 tarjetas: Lavado doméstico, Limpieza en seco, Eliminación de manchas, Planchado |
| **Características** | 5 beneficios clave con iconos animados y badge flotante |
| **Proceso** | 4 pasos con línea de progreso animada al entrar en viewport |
| **Testimonios** | Carrusel deslizable con 4 reseñas y stack de avatares (+20k clientes) |
| **Blog** | Grid de 4 artículos con imagen, fecha y autor |
| **Footer** | Newsletter, links rápidos, datos de contacto y acceso al sistema |

### Conexión con el sistema

Todos los botones y links de conversión de la landing page apuntan a `/login`, donde el personal puede autenticarse para acceder al sistema de gestión.

```
Landing (/)  ──►  Login (/login)  ──►  Dashboard (/dashboard)
                                   └──►  Pedidos, Clientes, etc.
```

---

## Módulos del sistema

### Pedidos
- Creación con selección de cliente, empleado, servicios y prendas (tipo, color, peso, cantidad)
- Listado con búsqueda, filtros por estado y paginación del lado del servidor
- Detalle con historial de estados, cambio de estado y registro de pagos
- Eliminación con confirmación

### Clientes
- Registro y edición con datos de contacto
- Gestión de personas autorizadas para retirar pedidos
- Perfil del cliente con historial completo de pedidos y estadísticas

### Servicios
- Catálogo de servicios con nombre, descripción y precio base
- Creación, edición y eliminación

### Pagos
- Registro de pagos asociados a pedidos
- Métodos aceptados: efectivo, tarjeta, Yape, Plin, transferencia
- Estados: pendiente, pagado, anulado
- Anulación de pagos con confirmación

### Empleados _(solo administrador)_
- Alta de empleados con generación de credenciales de acceso
- Edición de datos y asignación de rol
- Activación / desactivación

### Reportes _(solo administrador)_
- Resumen: pedidos del día, ingresos del día, pedidos del mes, total de clientes
- Gráfico de ingresos de los últimos 7 días
- Gráfico de ingresos de los últimos 6 meses
- Ranking de servicios más solicitados
- Distribución de pedidos por estado

### Dashboard operario
- Vista simplificada con pedidos urgentes, atrasados y para hoy
- Cambio rápido de estado directamente desde el dashboard

### Consulta pública
- Búsqueda de pedidos por código (`LAV-XXXXXX`) sin autenticación
- Timeline visual del historial de estados

### Recibo
- Recibo imprimible con detalle de prendas y servicios
- Desglose de subtotal, IGV (18%) y total
- Código QR para consultar el estado del pedido

---

## Roles y permisos

| Rol | Dashboard | Pedidos | Clientes | Servicios | Pagos | Empleados | Reportes |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `administrador` | Completo | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `recepcionista` | Completo | ✔ | ✔ | Solo lectura | ✔ | — | — |
| `operario` | Operario | Solo asignados | — | — | — | — | — |

---

## Autenticación

El sistema utiliza **JWT** con doble token (gestionados por [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)):

- `access` — token de corta duración (60 min) incluido en el header `Authorization: Bearer`
- `refresh` — token de larga duración (7 días) usado para renovar el access token automáticamente

El cliente Axios (`src/lib/api.ts`) intercepta las respuestas `401` para intentar renovar el token transparentemente. Si la renovación falla, se limpia la sesión y se redirige al login.

La sesión se persiste en `localStorage` mediante Zustand, permitiendo que el usuario permanezca autenticado entre sesiones.

> La landing page (`/`) y la consulta pública (`/pedido/:codigo`) son las únicas rutas accesibles sin autenticación.

---

## Endpoints del backend

Todos los endpoints requieren `Authorization: Bearer <access_token>` salvo los indicados.

### Autenticación _(público)_
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login/` | Obtener tokens (username + password) |
| `POST` | `/api/auth/refresh/` | Renovar access token |
| `POST` | `/api/auth/logout/` | Invalidar refresh token |

### Pedidos
| Método | Ruta | Descripción |
|---|---|---|
| `GET / POST` | `/api/pedidos/` | Listar / crear pedidos |
| `GET / PATCH / DELETE` | `/api/pedidos/{id}/` | Detalle, actualizar o eliminar |
| `POST` | `/api/pedidos/{id}/cambiar-estado/` | Cambiar estado del pedido |
| `GET` | `/api/pedidos/{id}/recibo/` | Descargar recibo PDF |
| `GET` | `/pedido/{codigo}/` | Consulta pública por código _(sin auth)_ |

### Clientes
| Método | Ruta | Descripción |
|---|---|---|
| `GET / POST` | `/api/clientes/` | Listar / crear clientes |
| `GET / PATCH / DELETE` | `/api/clientes/{id}/` | Detalle, actualizar o eliminar |
| `GET / POST` | `/api/clientes/autorizadas/` | Personas autorizadas |

### Servicios
| Método | Ruta | Descripción |
|---|---|---|
| `GET / POST` | `/api/servicios/` | Listar / crear servicios |
| `GET / PATCH / DELETE` | `/api/servicios/{id}/` | Detalle, actualizar o eliminar |
| `GET / POST` | `/api/servicios/detalles/` | Detalles de servicio por prenda |

### Pagos
| Método | Ruta | Descripción |
|---|---|---|
| `GET / POST` | `/api/pagos/` | Listar / registrar pagos |
| `GET / PATCH / DELETE` | `/api/pagos/{id}/` | Detalle, actualizar o anular |

### Empleados _(admin)_
| Método | Ruta | Descripción |
|---|---|---|
| `GET / POST` | `/api/usuarios/empleados/` | Listar / crear empleados |
| `GET / PATCH / DELETE` | `/api/usuarios/empleados/{id}/` | Detalle, actualizar o eliminar |

### Reportes _(admin)_
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/reportes/analytics/` | Estadísticas y resumen del período |
| `GET` | `/api/reportes/excel/` | Exportar pedidos a Excel |
