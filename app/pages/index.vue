<template>
  <div class="px-4">
    <h6>Total</h6>
    <h2 class="text-4xl font-bold">R$ 20.000,00</h2>
  </div>
  <LoanCoinsBorder />
  <div class="grid gap-2.5">
    <NuxtLink to="/1">
      <LoanHomeCard />
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
<script setup lang="ts">
const { data } = await useFetch("/api/loan/list");
const { openAddLoanModal } = useLoanStore();
</script>
