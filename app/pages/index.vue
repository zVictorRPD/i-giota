<template>
  <template v-if="data !== undefined">
    <div class="px-4">
      <h6>Total a receber</h6>
      <h2 class="text-4xl font-bold">{{ totalToReceive }}</h2>
    </div>
    <LoanCoinsBorder />
    <div class="grid gap-2.5">
      <NuxtLink v-for="loan in data.loans" :to="`/${loan.id}`">
        <LoanCard :loan="loan" />
      </NuxtLink>
    </div>
    <UButton
      icon="i-lucide-plus"
      color="neutral"
      class="absolute p-4 bottom-0 right-0"
      size="xl"
      @click="openAddLoanModal"
    >
      <span class="sr-only"> Adicionar Empréstimo </span>
    </UButton>
    <LoanAddModal />
  </template>
</template>
<script setup lang="ts">
const { data } = await useFetch("/api/loan/list");
const { openAddLoanModal } = useLoanStore();
const totalToReceive = computed(() => {
  const totalLoans =
    data.value?.loans.reduce((acc, loan) => acc + loan.totalValue, 0) || 0;
  const totalParcels =
    data.value?.loans.reduce((acc, loan) => acc + loan.parcelsTotalPaid, 0) ||
    0;

  return moneyMask(String(totalLoans - totalParcels));
});
</script>
