<template>
  <div class="grid grid-cols-2 py-4 border-b border-muted">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge v-if="transaction.category" color="neutral" variant="outline">
          {{ transaction.category }}
        </UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdownMenu
          :items="items"
          :content="{
            align: 'end'
          }">
          <UButton
            color="neutral"
            variant="link"
            trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading"/>
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object
})

const emit = defineEmits(['deleted'])
const isIncome = computed(
  () => props.transaction.type === 'Income'
)
const icon = computed(
  () => isIncome.value
    ? 'i-heroicons-arrow-up-right'
    : 'i-heroicons-arrow-down-left'
)
const iconColor = computed(
  () => isIncome.value
    ? 'text-success'
    : 'text-error'
)

const { currency } = useCurrency(props.transaction.amount)

const isLoading = ref(false)
const toast = useToast()
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
  isLoading.value = true
  try {
    await supabase.from('transactions')
      .delete()
      .eq('id', props.transaction.id)
    toast.add({
      title: 'Succeeded to delete transaction',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
    emit('deleted', props.transaction.id)
  } catch (error) {
    toast.add({
      title: 'Failed to delete transaction',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const items = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    onSelect: () => console.log('Edit')
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    onSelect: deleteTransaction
  }
]
</script>
