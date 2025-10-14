import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Insured, InsuredFull } from "@/store/interfaces/insured";

import { getByRut, onlyGetByRut } from "../services/insured.service";

interface insuredState {
  insured: InsuredFull;
  insuredOnly: Insured;
  isLoading: boolean;
  isError: boolean;
  error: string;
  getByRut: (rut: string) => void;
  reset: () => void;
  onlyGetByRut: (rut: string) => void;
}

const initialData: InsuredFull = {
  insured: {
    id: "",
    rut: "",
    name: "",
    paternalLastname: "",
    maternalLastname: "",
    address: "",
    district: "",
    email: "",
    phone: "",
    birthdate: "",
  },
  beneficiaries: [],
  products: [],
  cases: [],
};

export const insuredStore = create<insuredState>()(
  devtools(
    (set) => ({
      insured: initialData,
      insuredOnly: initialData.insured,
      isLoading: false,
      isError: false,
      error: "",

      getByRut: async (rut: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const data = await getByRut(rut);

          if (!data.success) {
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
            insured: data.data,
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

      onlyGetByRut: async (rut: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const data = await onlyGetByRut(rut);

          if (!data.success) {
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
            insuredOnly: data.data,
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
          insured: initialData,
        }));
      },
    }),
    {
      name: "insuredStore",
    }
  )
);
