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
