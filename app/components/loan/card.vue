<template>
  <MainCard>
    <div class="grid gap-1">
      <h6 class="font-bold">{{ loan.name }}</h6>
      <p>{{ totalPaid }} / {{ totalValue }}</p>
    </div>
    <div class="grid gap-1 text-right">
      <h6 class="font-bold">{{ percentPaid }}%</h6>
      <p class="text-sm">{{ nextPayment }}</p>
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
  return props.loan.nextPayment
});
</script>
