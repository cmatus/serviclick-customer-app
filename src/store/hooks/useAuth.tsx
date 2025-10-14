import { authStore } from "../zustand/auth.store";

const useAuth = () => {
  const { user, isLoading, isError, error, validate } = authStore();

  return {
    authUser: user,
    authIsLoading: isLoading,
    authIsError: isError,
    authError: error,
    authValidate: validate,
  };
};

export default useAuth;
