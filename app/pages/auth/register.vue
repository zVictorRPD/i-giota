<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Cadastro"
      description="Crie sua conta"
      icon="i-lucide-user"
      :fields="fields"
      @submit="onSubmit"
      :submit="{
        label: 'Cadastrar',
        color: 'primary',
        type: 'submit',
        loading: isSubmitting,
      }"
    >
      <template #description>
        Já tem uma conta?
        <ULink to="/auth/login" class="text-primary font-medium">Entre</ULink>
      </template>
    </UAuthForm>
  </UPageCard>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
definePageMeta({
  layout: "auth",
});

const isSubmitting = ref(false);

const toast = useToast();

const fields: AuthFormField[] = [
  {
    label: "Nome",
    name: "name",
    type: "text",
    placeholder: "Insira seu nome",
    required: true,
  },
  {
    label: "E-mail",
    name: "email",
    type: "email",
    placeholder: "Insira seu e-mail",
    required: true,
  },
  {
    label: "Senha",
    name: "password",
    type: "password",
    placeholder: "Insira sua senha",
    required: true,
  },
];

const schema = z.object({
  name: z
    .string("Nome obrigatório")
    .min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z
    .string("Senha obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isSubmitting.value = true;
    await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: payload.data.name,
        email: payload.data.email,
        password: payload.data.password,
      },
    });
    toast.add({
      title: "Cadastro realizado com sucesso! Faça login para continuar.",
      color: "success",
    });
    await navigateTo("/auth/login");
  } catch (error: any) {
    const errorMessage =
      error.data?.statusMessage || "Ocorreu um erro. Tente novamente.";
    toast.add({
      title: errorMessage,
      color: "error",
    });
    console.error("Erro de login:", errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
