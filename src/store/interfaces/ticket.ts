export interface ITicketReimbursementListItem {
  id: string;
  date: string;
  ticketId: string;
  leadId: string;
  product: {
    id: string;
    name: string;
  };
  assistance: {
    id: string;
    name: string;
  };
  amount: number;
  status: string;
}

interface ITicketReimbursementAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface ITicketReimbursement {
  leadId: string;
  productId: string;
  assistanceId: string;
  date: string;
  description: string;
  amount: number;
  bankCode: string;
  bankAccountTypeCode: string;
  bankAccountNumber: string;
  ticketId?: string;
  attachments: ITicketReimbursementAttachment[];
}

export interface ITicketReimbursementFile {
  url: string;
  expiresIn: number;
  expiresAt: string;
}
