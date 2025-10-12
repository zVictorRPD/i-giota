<template>
  <div class="px-4">
    <h2 class="text-4xl font-bold mb-4">Nome</h2>
    <div class="grid gap-2 grid-cols-4">
      <div class="grid">
        <h6>Crédito</h6>
        <p>R$ 5.000</p>
      </div>
      <div class="grid">
        <h6>Valor total</h6>
        <p>R$ 6.000</p>
      </div>
      <div class="grid">
        <h6>Juros</h6>
        <p>5.25 a.m</p>
      </div>
      <div class="grid">
        <h6>Pago</h6>
        <p>05/12</p>
      </div>
    </div>
  </div>
  <LoanCoinsBorder />
  <div class="grid gap-2.5 max-h-[calc(100vh-22.5rem)] overflow-y-auto">
    <LoanParcelCard
      v-for="value in 4"
      :key="value"
      @pay-parcel="payParcel"
      @cancel-parcel="cancelParcel"
    />
  </div>
  <UButton
    icon="i-lucide-plus"
    color="neutral"
    class="absolute p-4 bottom-0 right-0"
    size="xl"
    @click="openAddParcelModal"
  >
    <span class="sr-only"> Adicionar Parcela </span>
  </UButton>
  <LoanParcelAddModal />
</template>

<script setup lang="ts">
const route = useRoute();
const slot = route.params.slot as string;
const { openAddParcelModal } = useLoanStore();

const payParcel = () => {
  console.log("pay parcel", slot);
};

const cancelParcel = () => {
  console.log("cancel parcel", slot);
};
</script>
