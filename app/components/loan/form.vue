<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const totalValueMasked = computed({
  get() {
    return state.total_value || "";
  },
  set(newValue: string) {
    // Aplica a máscara ao digitar
    state.total_value = moneyMask(newValue);
  },
});

const schema = z
  .object({
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
    is_fixed: z.boolean().default(false),
    installments: z
      .number()
      .gte(1, "O número de parcelas deve ser maior ou igual a 1")
      .optional(),

    interest_rate: z
      .number()
      .gte(0, "A taxa de juros deve ser maior ou igual a 0")
      .optional(),

    start_date: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }, "A data de início não pode ser no passado"),
  })
  .superRefine((data, ctx) => {
    if (data.is_fixed) {
      if (data.installments === undefined || data.installments < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obrigatório",
          path: ["installments"], // Associa o erro ao campo 'installments'
        });
      }
      if (data.interest_rate === undefined || data.interest_rate < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obrigatório",
          path: ["interest_rate"], // Associa o erro ao campo 'interest_rate'
        });
      }
      if (!data.start_date) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obrigatório",
          path: ["start_date"], // Associa o erro ao campo 'start_date'
        });
      }
    }
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  total_value: undefined,
  is_fixed: false,
  installments: undefined,
  interest_rate: undefined,
  start_date: undefined,
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
<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nome" name="name">
      <UInput v-model="state.name" class="w-full" size="xl" />
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

    <div class="pt-4">
      <UButton type="submit" color="primary">Submit</UButton>
    </div>
  </UForm>
</template>
