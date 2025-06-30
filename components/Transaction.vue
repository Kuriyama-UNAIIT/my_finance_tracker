<template>
  <div class="grid grid-cols-3 py-4 border-b border-muted">
    <div class="flex items-center justify-between space-x-4 col-span-2">
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
          <TransactionModal v-model:open="isOpen" :transaction="transaction" @saved="emit('edited')" />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object
})

const emit = defineEmits(['edited', 'deleted'])
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
const toast = useAppToast()
const supabase = useSupabaseClient()

const isOpen = ref(false)

const deleteTransaction = async () => {
  isLoading.value = true
  try {
    await supabase.from('transactions')
      .delete()
      .eq('id', props.transaction.id)
    toast.success({
      title: 'Succeeded to delete transaction'
    })
    emit('deleted', props.transaction.id)
  } catch (error) {
    toast.error({
      title: 'Failed to delete transaction',
    })
  } finally {
    isLoading.value = false
  }
}

const items = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    onSelect: () => isOpen.value = true
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    onSelect: deleteTransaction
  }
]
</script>
