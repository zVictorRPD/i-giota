<template>
  <MainCard>
    <div class="grid gap-1">
      <h6 class="font-bold" :class="isPaid ? 'line-through opacity-60' : ''">
        {{ value }}
      </h6>
      <p>Parcela {{ number }} - {{ formattedDate }}</p>
    </div>
    <div class="flex justify-end items-center">
      <UButton
        v-if="!isPaid"
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
const props = defineProps<{
  number: number;
  parcel: {
    id: number;
    value: number;
    paidValue: number;
    dueDate: string | null;
    paidAt: string | null;
    loanId: number;
    createdAt: string;
    updatedAt: string;
  };
}>();

const formattedDate = computed(() => {
  if (!props.parcel.dueDate) return "Sem data";
  const date = new Date(props.parcel.dueDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
});

const isPaid = computed(() => {
  return props.parcel.paidAt !== null;
});

const value = computed(() => {
  return moneyMask(String(props.parcel.value));
});

const handlePay = () => {
  emit("payParcel");
};

const handleCancel = () => {
  emit("cancelParcel");
};
</script>
