import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IUI } from "../interfaces/ui.interface";

// Interface del store
interface IUIStore extends IUI {
  // Funciones
  setTitle: (title: string) => void;
  resetUI: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

// Estado inicial
const initialUIState: IUI = {
  title: "Dashboard",
  isLoading: false,
  isError: false,
  error: null,
};

// Store con middleware devtools
export const uiStore = create<IUIStore>()(
  devtools(
    (set) => ({
      ...initialUIState,

      setTitle: (title: string) => {
        set({ title }, false, "ui/setTitle");
      },

      resetUI: () => {
        set(initialUIState, false, "ui/resetUI");
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading }, false, "ui/setLoading");
      },

      setError: (error: string) => {
        set({ isError: true, error }, false, "ui/setError");
      },

      clearError: () => {
        set({ isError: false, error: null }, false, "ui/clearError");
      },
    }),
    {
      name: "uiStore",
    }
  )
);
