import { apiInstance } from "@/utils/api";

import { IDataResponse } from "@/interfaces/dataResponse";

export const getByRut = async (rut: string): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(`/payment/getByRut/${rut}`);
    return data;
  } catch (e) {
    throw e;
  }
};
