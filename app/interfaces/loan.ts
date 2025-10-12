export interface ILoanStorage {
  isAddLoanModalOpen: boolean;
  isAddParcelModalOpen: boolean;
}

export interface IListResponse {
  id: number,
  name: string,
  totalValue: number,
  parcelsTotalPaid: number,
  nextPayment: string,
}