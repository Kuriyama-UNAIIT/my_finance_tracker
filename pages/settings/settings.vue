<template>
  <UForm :schema="schema" :state="state" @submit.prevent="saveSettings" class="space-y-4">
    <UFormField label="Transaction View" help="Choose how you would like to view transactions">
      <USelectMenu v-model="state.transactionView" :items="transactionViewOptions"
        color="neutral" class="w-full"
      />
    </UFormField>
    <UButton type="submit" label="Save Changes" color="neutral" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<script setup>
import { z } from 'zod'
import { transactionViewOptions } from '~/constants'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useAppToast()

const pending = ref(false)

const schema = z.object({
  transactionView: z.enum(transactionViewOptions)
})

const state = ref({
  transactionView: user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]
})

const saveSettings = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView
      }
    })
    if (error) throw error
    toast.success({
      title: 'Succeeded to update your settings'
    })
  } catch (error) {
    toast.error({
      title: 'Failed to update your settings',
      description: error.message
    })
  } finally {
    pending.value = false
  }
}

useHead({
  title: 'Settings'
})
</script>
