<template>
  <header class="max-w-xl mx-auto p-4">
    <nav>
      <ul
        class="flex items-center gap-4"
        :class="returnToHome ? 'justify-between' : 'justify-end'"
      >
        <li v-if="returnToHome">
          <NuxtLink to="/" class="flex items-center gap-2 text-lg">
            <UIcon name="i-lucide-arrow-left" size="24" />
            Voltar
          </NuxtLink>
        </li>
        <li>
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            size="md"
            @click="handleLogout"
          />
        </li>
      </ul>
    </nav>
  </header>
  <main class="max-w-xl mx-auto p-4 min-h-[calc(100vh-4rem)] flex">
    <div class="flex-col relative w-full pb-[72px]">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const returnToHome = computed(() => route.name !== "index");
const { loggedIn, user, setUser } = useAuth();

async function handleLogout() {
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}
</script>
