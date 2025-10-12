<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nome" name="name">
      <UInput
        v-model="state.name"
        class="w-full"
        size="xl"
        placeholder="Nome"
      />
    </UFormField>
    <UFormField label="Valor total" name="total_value">
      <UInput
        v-model="totalValueMasked"
        placeholder="R$ 0,00"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <USwitch
      label="Pagamento fixo"
      v-model="state.is_fixed"
      name="is_fixed"
      size="xl"
    />

    <template v-if="state.is_fixed">
      <UFormField label="N° de parcelas" name="installments">
        <UInput
          type="number"
          v-model.number="state.installments"
          min="1"
          placeholder="1"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <UFormField label="Juros (%)" name="interest_rate">
        <UInput
          type="number"
          v-model.number="state.interest_rate"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <UFormField label="Data de início" name="start_date" class="col-span-2">
        <UInput
          type="date"
          v-model="state.start_date"
          :min="new Date().toISOString().split('T')[0]"
          class="w-full"
          size="xl"
        />
      </UFormField>
    </template>

    <div class="pt-4 text-end space-x-4">
      <UButton
        color="info"
        variant="ghost"
        size="xl"
        @click="closeAddLoanModal"
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
const toast = useToast();
const { closeAddLoanModal, registerLoan } = useLoanStore();

const totalValueMasked = computed({
  get() {
    return state.total_value || "";
  },
  set(newValue: string) {
    state.total_value = moneyMask(newValue);
  },
});

const schema = z.discriminatedUnion("is_fixed", [
  // Schema para quando is_fixed = false
  z.object({
    is_fixed: z.literal(false).default(false),
    name: z
      .string("Campo obrigatório")
      .min(2, "O nome deve ter no mínimo 2 caracteres"),
    total_value: z.string("Campo obrigatório").refine(
      (value) => {
        const numberValue = Number(removeMask(value));
        return !isNaN(numberValue) && numberValue > 0;
      },
      {
        message: "O valor total deve ser maior que 0",
      }
    ),
    // Campos opcionais quando não é fixo
    installments: z.number().optional(),
    interest_rate: z.number().optional(),
    start_date: z.string().optional(),
  }),

  // Schema para quando is_fixed = true
  z.object({
    is_fixed: z.literal(true),
    name: z
      .string("Campo obrigatório")
      .min(2, "O nome deve ter no mínimo 2 caracteres"),
    total_value: z.string("Campo obrigatório").refine(
      (value) => {
        const numberValue = Number(removeMask(value));
        return !isNaN(numberValue) && numberValue > 0;
      },
      {
        message: "O valor total deve ser maior que 0",
      }
    ),
    // Campos que agora são OBRIGATÓRIOS
    installments: z
      .number("Campo obrigatório")
      .gte(1, "O número de parcelas deve ser maior ou igual a 1"),
    interest_rate: z
      .number("Campo obrigatório")
      .gte(0, "A taxa de juros deve ser maior ou igual a 0"),
    start_date: z.string("Campo obrigatório").min(1, "Campo obrigatório"),
  }),
]);

export type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  total_value: undefined,
  is_fixed: false,
  installments: undefined,
  interest_rate: undefined,
  start_date: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const error = await registerLoan(event.data);
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
