<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "pt-BR",
  },
});

const title = "I-Giota";
const description =
  "I-Giota é um sistema para controle financeiro pessoal, registrando seus empréstimos e recebimentos.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});

const cookie = useCookie("user");

if (!cookie.value) {
  cookie.value = {
    id: 1,
    name: "Victor Martins",
    email: "victor2007azevedo@hotmail.com",
  };
}
</script>
