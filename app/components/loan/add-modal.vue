<template>
  <UModal
    title="Adicionar Empréstimo"
    aria-describedby="Adicionar um novo empréstimo"
    v-model:open="loanStore.isAddLoanModalOpen"
    class="max-w-[34rem]"
  >
    <template #body>
      <LoanForm />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const loanStore = useLoanStore();
</script>
