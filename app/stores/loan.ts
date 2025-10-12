import type { ILoanStorage } from "~/interfaces/loan";

export const useLoanStore = defineStore("loan", {
  state: (): ILoanStorage => ({
    isAddLoanModalOpen: false,
    isAddParcelModalOpen: false,
  }),
  actions: {
    openAddLoanModal() {
      this.isAddLoanModalOpen = true;
    },
    closeAddLoanModal() {
      this.isAddLoanModalOpen = false;
    },
    openAddParcelModal() {
      this.isAddParcelModalOpen = true;
    },
    closeAddParcelModal() {
      this.isAddParcelModalOpen = false;
    },
  },
});
