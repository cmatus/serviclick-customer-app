export interface InsuredFull {
  insured: Insured;
  beneficiaries: Beneficiary[];
  products: ProductItem[];
  cases: Case[];
}

export interface Insured {
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
}

export interface Beneficiary {
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
  relationship: string;
}

export interface ProductItem {
  leadId: string;
  channel: Channel;
  customer: Customer;
  product: Product;
}

export interface Channel {
  type: string;
  id: string;
  rut: string;
  name: string;
}

export interface Customer {
  id: string;
  rut: string;
  name: string;
  paternalLastname: string;
  maternalLastname: string;
  address: string;
  district: string;
  email: string;
  phone: string;
}

export interface Product {
  id: string;
  productPlanId: string;
  familyId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  frequency: string;
  beneficiaryMax: number;
  beneficiaryPrice: number;
  properties: Property[];
  assistances: Assistance[];
  beneficiaries: Beneficiary[];
  collect: Collect;
  policy: Policy;
}

export interface Property {
  id: string;
  name: string;
  value: string;
}

export interface Assistance {
  id: string;
  name: string;
  description: string;
  limit: string;
  maximum: string;
  amount: number;
  currency: string;
  events: number;
  lack: number;
  used: Used;
}

export interface Used {
  events: number;
  refund: number;
  imed: number;
}

export interface Beneficiary {
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
  relationship: string;
}

export interface Collect {
  feeValue: number;
  freeMonths: number;
  feesCharged: number;
  charged: number;
  paid: number;
  balance: number;
}

export interface Policy {
  buy: string;
  init: string;
  end: string;
  number: number;
}

export interface Case {
  id: string;
  number: number;
  date: string;
  product: {
    id: string;
    name: string;
  };
  assistance: {
    id: string;
    name: string;
  };
  procedure: {
    id: string;
    name: string;
  };
  status: {
    id: string;
    name: string;
    isClosed: boolean;
    isDeleted: boolean;
  };
}
