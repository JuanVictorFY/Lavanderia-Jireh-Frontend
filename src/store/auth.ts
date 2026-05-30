import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EmpleadoInfo {
  id: number;
  nombres: string;
  apellidos: string;
  rol: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  empleado: EmpleadoInfo | null;
  setTokens: (access: string, refresh: string) => void;
  setEmpleado: (empleado: EmpleadoInfo) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isOperario: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      empleado: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      setEmpleado: (empleado) => set({ empleado }),
      logout: () => set({ accessToken: null, refreshToken: null, empleado: null }),
      isAuthenticated: () => !!get().accessToken,
      isAdmin:     () => get().empleado?.rol === "administrador",
      isOperario:  () => get().empleado?.rol === "operario",
    }),
    { name: "lavanderia-auth" }
  )
);
