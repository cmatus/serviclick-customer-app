import { paymentStore } from "../zustand/payment.store";

const usePayment = () => {
  const { list, isLoading, isError, error, getByRut, reset } = paymentStore();

  return {
    paymentList: list,
    paymentIsLoading: isLoading,
    paymentIsError: isError,
    paymentError: error,
    paymentGetByRut: getByRut,
    paymentReset: reset,
  };
};

export default usePayment;
