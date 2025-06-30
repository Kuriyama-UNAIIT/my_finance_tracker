<template>
  <header class="border-b border-muted">
    <div class="container mx-auto max-w-4xl">
      <div class="flex items-center justify-between p-4">
        <NuxtLink to="/" class="text-2xl font-bold">Finance Tracker</NuxtLink>
        <div class="flex items-center space-x-4">
          <ColorModeSwitch />
          <AccountMenu />
        </div>
      </div>
    </div>
  </header>
</template>
