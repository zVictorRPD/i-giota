<template>
  <template v-if="pending">
    <div class="flex justify-center items-center h-96">
      <UIcon name="i-lucide-loader-circle" class="animate-spin" :size="40" />
    </div>
  </template>
  <div class="px-4" v-if="data !== undefined && data.loan">
    <h6>{{ totalValue }}</h6>
    <h2 class="text-4xl font-bold mb-4">{{ data.loan.name }}</h2>
    <div class="grid gap-2 grid-cols-2 md:grid-cols-4">
      <div class="grid">
        <h6>Recebido</h6>
        <p>{{ received }}</p>
      </div>
      <template v-if="data.loan.isFixed">
        <div class="grid">
          <h6>A receber</h6>
          <p>{{ totalToReceive }}</p>
        </div>
      </template>
      <div class="grid">
        <h6>Parcelas pagas</h6>
        <p>{{ paidParcels }}</p>
      </div>
      <template v-if="data.loan.isFixed && data.loan.interestRate">
        <div class="grid">
          <h6>Juros</h6>
          <p>{{ data.loan.interestRate.toFixed(2) }} a.m</p>
        </div>
      </template>
    </div>
  </div>
  <LoanCoinsBorder />
  <div class="grid gap-2.5 max-h-[calc(100vh-24rem)] overflow-y-auto">
    <template v-if="data?.parcels && data?.parcels?.length > 0">
      <LoanParcelCard
        v-for="(parcel, index) in data.parcels"
        :key="parcel.id"
        :parcel="parcel"
        :number="index + 1"
        @pay-parcel="handlePayParcel(parcel)"
        @cancel-parcel="handleCancelParcel(parcel.id)"
        @delete-parcel="openDeleteParcelModal(parcel)"
      />
    </template>
    <template v-else>
      <div class="flex flex-col justify-center items-center h-96 text-center">
        <UIcon name="i-lucide-inbox" :size="48" class="opacity-60 mb-4" />
        <h6 class="font-bold">Nenhuma parcela encontrada</h6>
        <p class="text-sm opacity-60">
          Adicione uma nova parcela para começar a gerenciar seus empréstimos
        </p>
      </div>
    </template>
  </div>
  <UButton
    icon="i-lucide-plus"
    color="success"
    class="absolute p-4 bottom-0 right-0"
    size="xl"
    @click="handleAddParcel"
  >
    <span class="sr-only"> Adicionar Parcela </span>
  </UButton>
  <LoanParcelAddModal />
  <LoanParcelDeleteModal />
</template>

<script setup lang="ts">
import type { IParcel } from "~/interfaces/loan";
const toast = useToast();
const route = useRoute();
const slot = route.params.slot as string;
const {
  openAddParcelModal,
  setParcelData,
  disableRefreshParcels,
  cancelParcel,
  openDeleteParcelModal,
} = useLoanStore();
const { refreshParcels } = storeToRefs(useLoanStore());
const { data, pending, refresh } = await useFetch("/api/loan", {
  params: { id: slot },
});

watch(refreshParcels, (newVal) => {
  if (newVal) {
    refresh();
    disableRefreshParcels();
  }
});

const handleAddParcel = () => {
  setParcelData(null);
  openAddParcelModal();
};

const handlePayParcel = (parcel: IParcel) => {
  setParcelData(parcel);
  openAddParcelModal();
};

const handleCancelParcel = async (parcelId: number) => {
  const error = await cancelParcel(parcelId);
  if (!error) {
    toast.add({
      title: "Sucesso",
      description: "Parcela deletada com sucesso.",
      color: "success",
    });
    return;
  }
  toast.add({
    title: "Erro",
    description: error?.message || "Ocorreu um erro ao deletar a parcela.",
    color: "error",
  });
};

const totalValue = computed(() => {
  return moneyMask(String(data.value?.loan?.totalValue || 0));
});

const received = computed(() => {
  return moneyMask(String(data.value?.receivedValue || 0));
});

const totalToReceive = computed(() => {
  return moneyMask(String(data.value?.totalToReceive || 0));
});

const paidParcels = computed(() => {
  if (!data.value?.parcels) return 0;
  return data.value?.parcels.filter((parcel) => parcel.paidAt).length || 0;
});
</script>
