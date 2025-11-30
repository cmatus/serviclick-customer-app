import { apiAuthInstance } from "@/utils/api";

import { IDataResponse } from "@/interfaces/dataResponse";

export const validate = async (
  login: string,
  password: string
): Promise<IDataResponse> => {
  try {
    const { data } = await apiAuthInstance.post(`/user/validate`, {
      login,
      password,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

export const sendPasswordRecoveryEmail = async (
  rut: string,
  email: string
): Promise<IDataResponse> => {
  try {
    const { data } = await apiAuthInstance.post(`/user/sendPasswordReset`, {
      rut,
      email,
    });
    return data;
  } catch (e) {
    throw e;
  }
};
