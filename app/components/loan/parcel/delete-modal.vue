<template>
  <UModal
    title="Deletar parcela"
    aria-describedby="Deletar uma parcela"
    v-model:open="isDeleteParcelModalOpen"
    class="max-w-[34rem]"
  >
    <template #body>
      <div class="space-y-4">
        <p>
          Tem certeza que deseja deletar a parcela com valor de
          <strong>{{ moneyMask(String(parcelData?.value)) }}</strong>? Esta ação não pode ser
          desfeita.
        </p>
        <div class="pt-4 text-end space-x-4">
          <UButton color="info" variant="ghost" size="xl" @click="isDeleteParcelModalOpen = false">
            Voltar
          </UButton>
          <UButton color="error" size="xl" @click="handleDeleteParcel" :loading="submitting">
            Deletar
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
const { deleteParcel } = useLoanStore();
const { parcelData, isDeleteParcelModalOpen, submitting } = storeToRefs(useLoanStore());
const toast = useToast();
const handleDeleteParcel = async () => {
  const error = await deleteParcel(parcelData.value?.id!);
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
</script>
