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
      <UInput
        type="date"
        v-model="state.date"
        :min="new Date().toISOString().split('T')[0]"
        class="w-full"
        size="xl"
      />
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
      <UButton type="submit" color="info" size="xl">Cadastrar</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
const { closeAddParcelModal } = useLoanStore();

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
  date: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log("event", event);

  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
}
</script>
