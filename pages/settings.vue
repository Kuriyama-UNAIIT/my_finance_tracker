<template>
  <div class="grid grid-cols-6 gap-8">
    <UNavigationMenu :items="items" orientation="vertical" color="neutral" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
const items = [
  {
    label: 'Profile',
    onClick: () => navigateTo('/settings/profile')
  },
  {
    label: 'Avatar',
    onClick: () => navigateTo('/settings/avatar')
  },
  {
    label: 'Settings',
    onClick: () => navigateTo('/settings/settings')
  }
]

</script>
