import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { IPayment } from "@/store/interfaces/payment";

import { getByRut } from "../services/payment.service";

interface paymentState {
  list: IPayment[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  getByRut: (rut: string) => void;
  reset: () => void;
  onlyGetByRut: (rut: string) => void;
}

export const paymentStore = create<paymentState>()(
  devtools(
    (set) => ({
      list: [],
      isLoading: false,
      isError: false,
      error: "",

      getByRut: async (rut: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const { data, success } = await getByRut(rut);

          if (!success) {
            set((state) => ({
              ...state,
              isLoading: false,
              isError: true,
              error: data.error || "",
            }));
            return;
          }

          set((state) => ({
            ...state,
            list: data,
            isLoading: false,
          }));

          return;
        } catch (e) {
          set((state) => ({
            ...state,
            isLoading: false,
            isError: true,
            error: (e as Error).message,
          }));
          return;
        }
      },

      reset: () => {
        set((state) => ({
          ...state,
          list: [],
          isLoading: false,
          isError: false,
          error: "",
        }));
      },
    }),
    {
      name: "paymentStore",
    }
  )
);
