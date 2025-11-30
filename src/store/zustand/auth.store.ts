import { create } from "zustand";
import { devtools } from "zustand/middleware";
import jwt from "jsonwebtoken";

import { IUser } from "@/store/interfaces/user";

import { validate, sendPasswordRecoveryEmail } from "../services/auth.service";

import { insuredStore } from "./insured.store";

interface authState {
  user: IUser;
  isLoading: boolean;
  isError: boolean;
  error: string;
  validate: (email: string, password: string) => void;
  sendPasswordRecoveryEmail: (rut: string, email: string) => void;
}

const initialData: IUser = {
  id: "",
  insuredId: "",
  login: "",
  hash: "",
  isActive: false,
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
};

export const authStore = create<authState>()(
  devtools(
    (set) => ({
      user: initialData,
      isLoading: false,
      isError: false,
      error: "",

      validate: async (email: string, password: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const { data, success } = await validate(email, password);

          if (!success) {
            set((state) => ({
              ...state,
              isLoading: false,
              isError: true,
              error: data.error,
            }));
          }

          const decodedToken = jwt.decode(data) as IUser | null;

          if (!decodedToken) {
            set((state) => ({
              ...state,
              isLoading: false,
              isError: true,
              error: "Token inválido",
            }));
          }

          localStorage.setItem("jwtToken", data);

          if (
            decodedToken &&
            decodedToken.insured &&
            decodedToken.insured.rut
          ) {
            insuredStore.getState().getByRut(decodedToken.insured.rut);
            set((state) => ({
              ...state,
              user: decodedToken,
              isLoading: false,
            }));
          }
        } catch (e) {
          set((state) => ({
            ...state,
            isLoading: false,
            isError: true,
            error: (e as Error).message,
          }));
        }
      },

      sendPasswordRecoveryEmail: async (rut: string, email: string) => {
        try {
          set((state) => ({
            ...state,
            isLoading: true,
            isError: false,
            error: "",
          }));
          const { data, success } = await sendPasswordRecoveryEmail(rut, email);

          if (!success) {
            set((state) => ({
              ...state,
              isLoading: false,
              isError: true,
              error: data.error,
            }));
            return;
          }

          set((state) => ({
            ...state,
            isLoading: false,
            isError: false,
            error: "",
          }));
        } catch (e) {
          set((state) => ({
            ...state,
            isLoading: false,
            isError: true,
            error: (e as Error).message,
          }));
        }
      },
    }),
    {
      name: "authStore",
    }
  )
);
