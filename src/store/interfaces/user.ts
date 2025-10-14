export interface IUser {
  id: string;
  insuredId: string;
  login: string;
  hash: string;
  isActive: boolean;
  insured: {
    id: string;
    rut: string;
    name: string;
    paternalLastname: string;
    maternalLastname: string;
    address: string;
    district: string;
    email: string;
    phone: string;
    birthdate: string;
  };
}
