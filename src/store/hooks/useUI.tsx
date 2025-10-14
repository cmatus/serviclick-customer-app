import { uiStore } from "../zustand/ui.store";

const useUI = () => {
  const {
    title,
    isLoading,
    isError,
    error,
    setTitle,
    resetUI,
    setLoading,
    setError,
    clearError,
  } = uiStore();

  return {
    uiTitle: title,
    uiIsLoading: isLoading,
    uiIsError: isError,
    uiError: error,
    uiSetTitle: setTitle,
    uiResetUI: resetUI,
    uiSetLoading: setLoading,
    uiSetError: setError,
    uiClearError: clearError,
  };
};

export default useUI;
