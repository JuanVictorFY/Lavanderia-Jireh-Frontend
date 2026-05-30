import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Pedidos } from "@/pages/Pedidos";
import { PedidoDetalle } from "@/pages/PedidoDetalle";
import { NuevoPedido } from "@/pages/NuevoPedido";
import { Clientes } from "@/pages/Clientes";
import { ClienteDetalle } from "@/pages/ClienteDetalle";
import { Servicios } from "@/pages/Servicios";
import { Pagos } from "@/pages/Pagos";
import { Empleados } from "@/pages/Empleados";
import { Reportes } from "@/pages/Reportes";
import { ConsultaPublica } from "@/pages/ConsultaPublica";
import { Recibo } from "@/pages/Recibo";

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/pedido/:codigo" element={<ConsultaPublica />} />
          <Route path="/pedidos/:id/recibo" element={<Recibo />} />

          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/nuevo" element={<NuevoPedido />} />
            <Route path="/pedidos/:id" element={<PedidoDetalle />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<ClienteDetalle />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/reportes" element={<Reportes />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
