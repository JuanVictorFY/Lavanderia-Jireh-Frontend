# Lavanderia Jireh — Frontend

Sistema de gestion para lavanderia. Permite registrar pedidos, clientes, empleados y pagos, con dashboards diferenciados por rol y consulta publica de estado de pedidos.

## Tecnologias

- **React 19** + **TypeScript**
- **Vite 8** — bundler y servidor de desarrollo
- **Tailwind CSS 4** — estilos utilitarios
- **React Router 7** — enrutamiento SPA
- **Zustand** — estado global de sesion
- **TanStack Query** — fetching y cache de datos
- **Axios** — cliente HTTP
- **React Hook Form** + **Zod** — formularios y validacion
- **Recharts** — graficos en reportes
- **Radix UI** — componentes accesibles
- **Lucide React** — iconos
- **QRCode.react** — generacion de QR en recibos

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:8000` (ver [LavanderiaJirehBackend](../LavanderiaJirehBackend))

## Instalacion

```bash
npm install
```

## Comandos

```bash
# Servidor de desarrollo
npm run dev

# Build de produccion
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

## Estructura del proyecto

```
src/
├── assets/           # Imagenes y SVGs
├── components/
│   ├── layout/       # AppLayout y Sidebar
│   └── ui/           # Componentes reutilizables (Button, Card, Modal...)
├── lib/
│   ├── api.ts        # Cliente HTTP con interceptores JWT
│   └── utils.ts      # Helpers generales
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── DashboardOperario.tsx
│   ├── Pedidos.tsx / PedidoDetalle.tsx / NuevoPedido.tsx
│   ├── Clientes.tsx / ClienteDetalle.tsx
│   ├── Empleados.tsx
│   ├── Servicios.tsx
│   ├── Pagos.tsx
│   ├── Recibo.tsx
│   ├── Reportes.tsx
│   └── ConsultaPublica.tsx
├── store/
│   └── auth.ts       # Store de sesion con Zustand
└── types/
    └── index.ts      # Tipos globales de la aplicacion
```

## Roles del sistema

| Rol | Acceso |
|-----|--------|
| `administrador` | Dashboard completo, empleados, reportes, servicios |
| `recepcionista` | Pedidos, clientes, pagos, nuevo pedido |
| `operario` | Dashboard operario (solo pedidos asignados) |

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

```env
VITE_API_URL=http://localhost:8000
```

Por defecto apunta a `http://localhost:8000` si no se define la variable.
