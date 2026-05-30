# Lavandería Jireh — Frontend

Sistema de gestión integral para lavanderías. Permite administrar pedidos, clientes, empleados, servicios y pagos, con dashboards diferenciados por rol, reportes analíticos y consulta pública del estado de pedidos.

---

## Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Comandos disponibles](#comandos-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos del sistema](#módulos-del-sistema)
- [Roles y permisos](#roles-y-permisos)
- [Autenticación](#autenticación)

---

## Características

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

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 19.2 |
| Lenguaje | TypeScript | 6.0 |
| Bundler | Vite | 8.0 |
| Estilos | Tailwind CSS | 4.3 |
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

---

## Requisitos

- **Node.js** 18 o superior
- **Backend** corriendo en `http://localhost:8000`

> El backend del proyecto se encuentra en el repositorio [Lavandería Jireh — Backend](../LavanderiaJirehBackend).

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JuanVictorFY/Lavanderia-Jireh-Frontend-Actualizado.git
cd Lavanderia-Jireh-Frontend-Actualizado

# Instalar dependencias
npm install
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000
```

Si no se define la variable, el proxy de Vite apunta a `http://localhost:8000` por defecto durante el desarrollo.

---

## Comandos disponibles

```bash
# Servidor de desarrollo con hot reload
npm run dev

# Build de producción
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
├── assets/                  # Imágenes, SVGs y recursos estáticos
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx    # Layout protegido con sidebar responsive
│   │   └── Sidebar.tsx      # Navegación lateral filtrada por rol
│   └── ui/
│       ├── alert.tsx
│       ├── badge.tsx        # Badge genérico + EstadoBadge por estado de pedido
│       ├── button.tsx
│       ├── card.tsx
│       ├── divider.tsx
│       ├── empty-state.tsx
│       ├── input.tsx
│       ├── modal.tsx        # Modal genérico + ConfirmModal
│       ├── pagination.tsx
│       ├── select.tsx
│       ├── skeleton.tsx     # SkeletonCard y SkeletonTable
│       ├── spinner.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── hooks/
│   ├── useClipboard.ts      # Copiar al portapapeles
│   ├── useConfirm.ts        # Modal de confirmación con estado
│   ├── useDebounce.ts       # Debounce de valores reactivos
│   ├── useFetch.ts          # Fetch básico con loading/error
│   ├── useKeyPress.ts       # Detección de teclas
│   ├── useLocalStorage.ts   # Persistencia en localStorage
│   ├── useMediaQuery.ts     # useIsMobile / useIsDesktop
│   ├── usePagination.ts     # Gestión de paginación
│   ├── useSort.ts           # Gestión de ordenamiento
│   ├── useTitle.ts          # document.title dinámico
│   └── useWindowSize.ts     # Dimensiones de ventana reactivas
├── lib/
│   ├── api.ts               # Cliente Axios con interceptores JWT y auto-refresh
│   ├── constants.ts         # Labels de estados, métodos de pago y roles
│   └── utils.ts             # 30+ helpers (formateo, validación, arreglos, fechas)
├── pages/
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
│   └── auth.ts              # Store de sesión (Zustand + persistencia)
├── types/
│   └── index.ts             # Interfaces y tipos globales del dominio
├── App.tsx                  # Router principal
└── main.tsx                 # Punto de entrada
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
- Búsqueda de pedidos por código sin autenticación
- Timeline visual del historial de estados

### Recibo
- Recibo imprimible con detalle de prendas y servicios
- Desglose de subtotal, IGV (18%) y total
- Código QR para compartir el estado del pedido

---

## Roles y permisos

| Rol | Dashboard | Pedidos | Clientes | Servicios | Pagos | Empleados | Reportes |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `administrador` | Completo | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `recepcionista` | Completo | ✔ | ✔ | Solo lectura | ✔ | — | — |
| `operario` | Operario | Solo asignados | — | — | — | — | — |

---

## Autenticación

El sistema utiliza **JWT** con doble token:

- `access` — token de corta duración incluido en el header `Authorization: Bearer`
- `refresh` — token de larga duración usado para renovar el access token automáticamente

El cliente Axios (`src/lib/api.ts`) intercepta las respuestas `401` para intentar renovar el token transparentemente. Si la renovación falla, se limpia la sesión y se redirige al login.

La sesión se persiste en `localStorage` mediante Zustand, permitiendo que el usuario permanezca autenticado entre sesiones.
