<template>
  <div class="px-4">
    <h6>Total a receber</h6>
    <h2 class="text-4xl font-bold">{{ totalToReceive }}</h2>
  </div>
  <LoanCoinsBorder />
  <template v-if="pending">
    <div class="flex justify-center items-center h-96">
      <UIcon name="i-lucide-loader-circle" class="animate-spin" :size="40" />
    </div>
  </template>
  <template v-else-if="data !== undefined">
    <template v-if="data.loans.length > 0">
      <div class="grid gap-2.5 max-h-[calc(100vh-20rem)] overflow-y-auto">
        <NuxtLink v-for="loan in data.loans" :to="`/${loan.id}`">
          <LoanCard :loan="loan" />
        </NuxtLink>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col justify-center items-center h-96 text-center">
        <UIcon name="i-lucide-inbox" :size="48" class="opacity-60 mb-4" />
        <h6 class="font-bold">Nenhum empréstimo encontrado</h6>
        <p class="text-sm opacity-60">
          Adicione um novo para começar a gerenciar sua vida financeira
        </p>
      </div>
    </template>

    <UButton
      icon="i-lucide-plus"
      color="neutral"
      class="absolute p-4 bottom-0 right-0"
      size="xl"
      @click="openAddLoanModal"
    >
      <span class="sr-only"> Adicionar Empréstimo </span>
    </UButton>
  </template>
  <LoanAddModal />
</template>
<script setup lang="ts">
const { data, refresh, pending } = await useFetch("/api/loan/list");
const { openAddLoanModal, disableRefreshLoans } = useLoanStore();
const { refreshLoans } = storeToRefs(useLoanStore());

watch(refreshLoans, (newVal) => {
  if (newVal) {
    refresh();
    disableRefreshLoans();
  }
});

const totalToReceive = computed(() => {
  const totalLoans =
    data.value?.loans.reduce((acc, loan) => acc + loan.totalValue, 0) || 0;
  const totalParcels =
    data.value?.loans.reduce((acc, loan) => acc + loan.parcelsTotalPaid, 0) ||
    0;
  return moneyMask(String(totalLoans - totalParcels));
});
</script>
