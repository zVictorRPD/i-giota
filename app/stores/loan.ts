import type { ILoanStorage } from "~/interfaces/loan";

export const useLoanStore = defineStore("loan", {
  state: (): ILoanStorage => ({
    isAddLoanModalOpen: false,
  }),
  actions: {
    openAddLoanModal() {
      this.isAddLoanModalOpen = true;
    },
    closeAddLoanModal() {
      this.isAddLoanModalOpen = false;
    },
  },
});
