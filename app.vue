<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
useHead({
  titleTemplate: '%s - My Finance Tracker',
  htmlAttrs: {
    lang: "en"
  }
})
</script>
