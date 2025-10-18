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
    submitting: false,
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
        this.submitting = true;
        await $fetch("/api/loan", {
          method: "POST",
          body: data,
        });
        this.refreshLoans = true;
        this.isAddLoanModalOpen = false;
      } catch (error: any) {
        console.error("Error registering loan:", error);
        return error;
      } finally {
        this.submitting = false;
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
        this.submitting = true;
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
      } finally {
        this.submitting = false;
      }
    },
    async cancelParcel(parcelId: number) {
      try {
        this.submitting = true;
        await $fetch(`/api/loan/parcel/cancel`, {
          method: "PUT",
          body: {
            parcelId,
          },
        });
        this.refreshParcels = true;
        this.parcelData = null;
        this.isAddParcelModalOpen = false;
      } catch (error: any) {
        console.error("Error canceling parcel:", error);
        return error;
      } finally {
        this.submitting = false;
      }
    },
    async deleteParcel(parcelId: number) {
      try {
        this.submitting = true;
        await $fetch(`/api/loan/parcel?id=${parcelId}`, {
          method: "DELETE",
        });
        this.refreshParcels = true;
        this.parcelData = null;
        this.isDeleteParcelModalOpen = false;
      } catch (error: any) {
        console.error("Error deleting parcel:", error);
        return error;
      } finally {
        this.submitting = false;
      }
    },
  },
});
