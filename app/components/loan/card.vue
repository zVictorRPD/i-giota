<template>
  <MainCard>
    <div class="grid gap-1">
      <h6 class="font-bold">{{ loan.name }}</h6>
      <p>{{ totalPaid }} / {{ totalValue }}</p>
    </div>
    <div class="grid gap-1 text-right items-center">
      <h6 class="font-bold">{{ percentPaid }}%</h6>
      <p class="text-sm" v-if="nextPayment">{{ nextPayment }}</p>
    </div>
  </MainCard>
</template>

<script setup lang="ts">
import type { IListResponse } from "~/interfaces/loan";

const props = defineProps<{
  loan: IListResponse;
}>();
const percentPaid = computed(() => {
  return (props.loan.parcelsTotalPaid / props.loan.totalValue) * 100;
});
const totalPaid = computed(() => {
  return moneyMask(String(props.loan.parcelsTotalPaid));
});
const totalValue = computed(() => {
  return moneyMask(String(props.loan.totalValue));
});
const nextPayment = computed(() => {
  if (!props.loan.nextPayment) return false;
  const date = new Date(props.loan.nextPayment);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
});
</script>
