<template>
  <div>
    <div class="font-bold" :class="props.color">{{ title }}</div>
    <div class="text-2xl font-extrabold mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>{{ currency }}</div>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6"
          :class="color" />
        <div class="text-muted">
          {{ persentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  color: String,
  amount: Number,
  lastAmount: Number,
  loading: Boolean
})
const { amount } = toRefs(props)
const trendingUp = computed(
  () => props.amount >= props.lastAmount
)
const color = computed(
  () => trendingUp.value ? 'text-success' : 'text-error'
)
const icon = computed(
  () => trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
)
const { currency } = useCurrency(amount)

const persentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return '-%'

  const bigger = Math.max(props.amount, props.lastAmount)
  const smaller = Math.min(props.amount, props.lastAmount)
  const ratio = ((bigger - smaller) / smaller) * 100

  return `${Math.ceil(ratio)}%`
})
</script>

<style scoped>

</style>
