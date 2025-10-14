import { apiInstance } from "@/utils/api";

import { IDataResponse } from "@/interfaces/dataResponse";

export const getByRut = async (rut: string): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(`/insured/getByRut/${rut}`);
    return data;
  } catch (e) {
    throw e;
  }
};

export const onlyGetByRut = async (rut: string): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(`/insured/onlyGetByRut/${rut}`);
    return data;
  } catch (e) {
    throw e;
  }
};
