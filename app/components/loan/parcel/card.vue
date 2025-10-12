<template>
  <MainCard>
    <div class="grid gap-1">
      <h6 class="font-bold">R$ 3.000,00</h6>
      <p>Parcela 1 - 30/11</p>
    </div>
    <div class="flex justify-end items-center">
      <UButton
        v-if="true"
        size="sm"
        color="success"
        icon="i-lucide-dollar-sign"
        label="Pagar"
        @click="handlePay"
      />
      <UButton
        v-else
        size="sm"
        color="error"
        icon="i-lucide-undo-2"
        label="Cancelar"
        @click="handleCancel"
      />
    </div>
  </MainCard>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "payParcel"): void;
  (e: "cancelParcel"): void;
}>();

const handlePay = () => {
  emit("payParcel");
};

const handleCancel = () => {
  emit("cancelParcel");
};
</script>
