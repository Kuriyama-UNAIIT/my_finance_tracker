<template>
  <ClientOnly>
    <UButton
      :icon="currentIcon"
      color="neutral"
      variant="ghost"
      size="xl"
      @click="toggleMode"/>
  </ClientOnly>
</template>

<script setup>
const colorMode = useColorMode()
const currentIcon = computed(() => {
  if (colorMode.value === 'dark') {
    return 'i-lucide-moon'
  } else {
    return 'i-lucide-sun'
  }
})
const toggleMode = () => {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light'
  } else {
    colorMode.preference = 'dark'
  }
}
</script>
