<template>
  <header class="max-w-xl mx-auto p-4">
    <nav>
      <ul class="flex justify-end gap-4">
        <li>
          <UButton icon="i-lucide-log-out" color="neutral" size="md" />
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
