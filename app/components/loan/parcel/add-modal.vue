<template>
  <UModal
    title="Registar Pagamento"
    aria-describedby="Registar um novo pagamento"
    v-model:open="loanStore.isAddParcelModalOpen"
    class="max-w-[34rem]"
  >
    <template #body>
      <LoanParcelForm />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const loanStore = useLoanStore();
</script>
