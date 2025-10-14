import { ticketStore } from "../zustand/ticket.store";

const useTicket = () => {
  const {
    ticket,
    ticketList,
    ticketFile,
    isLoading,
    isError,
    error,
    reimbursementUpsert,
    reimbursementGetByRut,
    reimbursementGetById,
    reimbursementGetFileById,
    reset,
  } = ticketStore();

  return {
    ticketItem: ticket,
    ticketList: ticketList,
    ticketFile: ticketFile,
    ticketIsLoading: isLoading,
    ticketIsError: isError,
    ticketError: error,
    ticketReimbursementUpsert: reimbursementUpsert,
    ticketReimbursementGetByRut: reimbursementGetByRut,
    ticketReimbursementGetById: reimbursementGetById,
    ticketReimbursementGetFileById: reimbursementGetFileById,
    ticketReset: reset,
  };
};

export default useTicket;
