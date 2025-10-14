export interface IPayment {
  leadId: string;
  product: {
    id: string;
    familyId: string;
    name: string;
  };
  payments: { date: string; amount: number }[];
  collect: {
    feeValue: number;
    freeMonths: number;
    feesCharged: number;
    charged: number;
    paid: number;
    balance: number;
  };
}
