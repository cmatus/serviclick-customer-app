import { authStore } from "../zustand/auth.store";

const useAuth = () => {
  const {
    user,
    isLoading,
    isError,
    error,
    validate,
    sendPasswordRecoveryEmail,
  } = authStore();

  return {
    authUser: user,
    authIsLoading: isLoading,
    authIsError: isError,
    authError: error,
    authValidate: validate,
    authSendPasswordRecoveryEmail: sendPasswordRecoveryEmail,
  };
};

export default useAuth;
