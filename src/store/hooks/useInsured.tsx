import { insuredStore } from "../zustand/insured.store";

const useInsured = () => {
  const {
    insured,
    insuredOnly,
    isLoading,
    isError,
    error,
    getByRut,
    reset,
    onlyGetByRut,
  } = insuredStore();

  return {
    insuredItem: insured,
    insuredIsLoading: isLoading,
    insuredIsError: isError,
    insuredError: error,
    insuredOnly: insuredOnly,
    insuredGetByRut: getByRut,
    insuredReset: reset,
    insuredOnlyGetByRut: onlyGetByRut,
  };
};

export default useInsured;
