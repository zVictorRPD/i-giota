export interface ILoanStorage {
  isAddLoanModalOpen: boolean;
  isAddParcelModalOpen: boolean;
  isDeleteParcelModalOpen: boolean;
  parcelData: IParcel | null;
  refreshLoans: boolean;
  refreshParcels: boolean;
}

export interface IListResponse {
  id: number;
  name: string;
  totalValue: number;
  parcelsTotalPaid: number;
  nextPayment: string;
}

export interface IParcel {
  id: number;
  value: number;
  paidValue: number;
  dueDate: string | null;
  paidAt: string | null;
  loanId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRegisterParcel {
  loanId: number;
  paidValue: string;
  dueDate: string;
  parcelId?: number;
}