import type { Schema as TAddLoanData } from "~/components/loan/form.vue";
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
    async registerLoan(data: TAddLoanData) {
      try {
        await $fetch("/api/loan", {
          method: "POST",
          body: data,
        });
      } catch (error: any) {
        console.error("Error registering loan:", error);
        return error;
      }
    },
    openAddParcelModal() {
      this.isAddParcelModalOpen = true;
    },
    closeAddParcelModal() {
      this.isAddParcelModalOpen = false;
    },
  },
});
