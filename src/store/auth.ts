import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EmpleadoInfo {
  id: number;
  nombres: string;
  apellidos: string;
  rol: string;
  es_admin_total?: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  empleado: EmpleadoInfo | null;
  lastRoute: string;
  setTokens: (access: string, refresh: string) => void;
  setEmpleado: (empleado: EmpleadoInfo) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  setLastRoute: (route: string) => void;
  isAdmin: () => boolean;
  isAdminTotal: () => boolean;
  isOperario: () => boolean;
  isRecepcionista: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      empleado: null,
      lastRoute: "/dashboard",
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      setEmpleado: (empleado) => set({ empleado }),
      logout: () => set({ accessToken: null, refreshToken: null, empleado: null }),
      setLastRoute: (route) => set({ lastRoute: route }),
      isAuthenticated:  () => !!get().accessToken,
      isAdmin:          () => get().empleado?.rol === "administrador",
      isAdminTotal:     () => get().empleado?.es_admin_total === true,
      isOperario:       () => get().empleado?.rol === "operario",
      isRecepcionista:  () => get().empleado?.rol === "recepcionista",
    }),
    { name: "lavanderia-auth" }
  )
);
