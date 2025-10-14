import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  ITicketReimbursementListItem,
  ITicketReimbursement,
  ITicketReimbursementFile,
} from "@/store/interfaces/ticket";

import {
  reimbursementGetByRut,
  reimbursementGetById,
  reimbursementUpsert,
  reimbursementGetFileById,
} from "../services/ticket.service";

interface ticketState {
  ticket: ITicketReimbursement;
  ticketList: ITicketReimbursementListItem[];
  ticketFile: ITicketReimbursementFile | null;
  isLoading: boolean;
  isError: boolean;
  error: string;
  reimbursementUpsert: (
    reimbursementData: ITicketReimbursement,
    files?: File[]
  ) => void;
  reimbursementGetByRut: (rut: string) => void;
  reimbursementGetById: (id: string) => void;
  reimbursementGetFileById: (id: string) => void;
  reset: () => void;
}

const initialData: ITicketReimbursement = {
  leadId: "",
  productId: "",
  assistanceId: "",
  date: "",
  description: "",
  amount: 0,
  bankCode: "",
  bankAccountTypeCode: "",
  bankAccountNumber: "",
  ticketId: "",
  attachments: [],
};

export const ticketStore = create<ticketState>()(
  devtools(
    (set) => ({
      ticket: initialData,
      ticketFile: null,
      ticketList: [],
      isLoading: false,
      isError: false,
      error: "",

      reimbursementUpsert: async (
        reimbursementData: ITicketReimbursement,
        files?: File[]
      ) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const data = await reimbursementUpsert(reimbursementData, files);

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
            ticket: data.data,
            isLoading: false,
            isError: false,
            error: "",
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

      reimbursementGetByRut: async (rut: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const data = await reimbursementGetByRut(rut);

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
            ticketList: data.data,
            isLoading: false,
            isError: false,
            error: "",
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

      reimbursementGetById: async (id: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));
          const data = await reimbursementGetById(id);

          if (!data.success) {
            set((state) => ({
              ...state,
              isLoading: false,
              isError: true,
              error: data.error || "",
            }));
            return;
          }

          console.log(data.data);

          set((state) => ({
            ...state,
            ticket: data.data,
            isLoading: false,
            isError: false,
            error: "",
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

      reimbursementGetFileById: async (id: string) => {
        try {
          set((state) => ({ ...state, isLoading: true }));

          const data = await reimbursementGetFileById(id);

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
            ticketFile: data.data,
            isLoading: false,
            isError: false,
            error: "",
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
          ticket: initialData,
          ticketFile: null,
          isLoading: false,
          isError: false,
          error: "",
        }));
      },
    }),
    {
      name: "ticketStore",
    }
  )
);
