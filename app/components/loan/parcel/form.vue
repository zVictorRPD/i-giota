<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Valor pago" name="paid_value">
      <UInput
        v-model="payedValueMasked"
        placeholder="R$ 0,00"
        class="w-full"
        size="xl"
      />
    </UFormField>
    <UFormField label="Data" name="date" class="col-span-2">
      <UInput type="date" v-model="state.date" class="w-full" size="xl" />
    </UFormField>
    <div class="pt-4 text-end space-x-4">
      <UButton
        color="info"
        variant="ghost"
        size="xl"
        @click="closeAddParcelModal"
      >
        Voltar
      </UButton>
      <UButton type="submit" color="success" size="xl" :loading="submitting">
        Registrar
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
const { closeAddParcelModal, registerParcel } = useLoanStore();
const { parcelData, submitting } = storeToRefs(useLoanStore());

onMounted(() => {
  if (parcelData.value) {
    state.paid_value = moneyMask(String(parcelData.value.value ?? ""));
    state.date = parcelData.value.dueDate
      ? new Date(parcelData.value.dueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
  }
});

const payedValueMasked = computed({
  get() {
    return state.paid_value || "";
  },
  set(newValue: string) {
    state.paid_value = moneyMask(newValue);
  },
});

const schema = z.object({
  paid_value: z.string("Campo obrigatório").refine(
    (value) => {
      const numberValue = Number(removeMask(value));
      return !isNaN(numberValue) && numberValue > 0;
    },
    {
      message: "O valor total deve ser maior que 0",
    }
  ),
  date: z.string("Campo obrigatório"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  paid_value: undefined,
  date: new Date().toISOString().split("T")[0],
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const error = await registerParcel({
    parcelId: parcelData.value?.id,
    loanId: parcelData.value?.loanId!,
    paidValue: event.data.paid_value,
    dueDate: event.data.date,
  });
  if (!error) {
    toast.add({
      title: "Sucesso",
      description: "Empréstimo cadastrado com sucesso!",
      color: "success",
    });
    return;
  }
  toast.add({
    title: "Erro",
    description: error?.message || "Ocorreu um erro ao cadastrar o empréstimo.",
    color: "error",
  });
}
</script>
