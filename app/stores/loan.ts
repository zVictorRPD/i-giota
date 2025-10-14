import type { Schema as TAddLoanData } from "~/components/loan/form.vue";
import type { ILoanStorage, IParcel, IRegisterParcel } from "~/interfaces/loan";

export const useLoanStore = defineStore("loan", {
  state: (): ILoanStorage => ({
    isAddLoanModalOpen: false,
    isAddParcelModalOpen: false,
    isDeleteParcelModalOpen: false,
    parcelData: null,
    refreshLoans: false,
    refreshParcels: false,
  }),
  actions: {
    openAddLoanModal() {
      this.isAddLoanModalOpen = true;
    },
    closeAddLoanModal() {
      this.isAddLoanModalOpen = false;
    },
    disableRefreshLoans() {
      this.refreshLoans = false;
    },
    async registerLoan(data: TAddLoanData) {
      try {
        await $fetch("/api/loan", {
          method: "POST",
          body: data,
        });
        this.refreshLoans = true;
        this.isAddLoanModalOpen = false;
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
    openDeleteParcelModal(parcelData: IParcel) {
      this.parcelData = parcelData;
      this.isDeleteParcelModalOpen = true;
    },
    setParcelData(parcelData: IParcel | null) {
      this.parcelData = parcelData;
    },
    disableRefreshParcels() {
      this.refreshParcels = false;
    },
    async registerParcel({
      loanId,
      paidValue,
      dueDate,
      parcelId,
    }: IRegisterParcel) {
      try {
        await $fetch("/api/loan/parcel", {
          method: "POST",
          body: {
            loanId,
            paidValue,
            dueDate,
            parcelId,
          },
        });
        this.refreshParcels = true;
        this.isAddParcelModalOpen = false;
      } catch (error: any) {
        console.error("Error registering parcel:", error);
        return error;
      }
    },
    async cancelParcel(parcelId: number) {
      try {
        await $fetch(`/api/loan/parcel/cancel/${parcelId}`, {
          method: "PUT",
        });
        this.refreshParcels = true;
        this.parcelData = null;
        this.isAddParcelModalOpen = false;
      } catch (error: any) {
        console.error("Error canceling parcel:", error);
        return error;
      }
    },
    async deleteParcel(parcelId: number) {
      try {
        await $fetch(`/api/loan/parcel/${parcelId}`, {
          method: "DELETE",
        });
        this.refreshParcels = true;
        this.parcelData = null;
        this.isAddParcelModalOpen = false;
      } catch (error: any) {
        console.error("Error deleting parcel:", error);
        return error;
      }
    },
  },
});
