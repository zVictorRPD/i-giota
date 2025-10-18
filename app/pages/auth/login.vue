<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Login"
      description="Acesse sua conta"
      icon="i-lucide-log-in"
      :fields="fields"
      @submit="onSubmit"
      :submit="{
        label: 'Entrar',
        color: 'primary',
        type: 'submit',
        loading: isSubmitting,
      }"
    >
      <template #description>
        Ainda não tem uma conta?
        <ULink to="/auth/register" class="text-primary font-medium"
          >Cadastre-se</ULink
        >
      </template>
    </UAuthForm>
  </UPageCard>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
const { setUser } = useAuth();
const toast = useToast();
const isSubmitting = ref(false);
definePageMeta({
  layout: "auth",
});

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "E-mail",
    placeholder: "Insira seu e-mail",
    required: true,
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    placeholder: "Insira sua senha",
    required: true,
  },
];

const schema = z.object({
  email: z.email("E-mail inválido"),
  password: z
    .string("Senha obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isSubmitting.value = true;
    const response = (await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: payload.data.email,
        password: payload.data.password,
      },
    })) as any;
    toast.add({
      title: "Login realizado com sucesso!",
      color: "success",
    });
    setUser(response.user);
    await navigateTo("/");
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
