<template>
  <UModal :title="isEditing ? 'Edit Transaction' : 'Add Transaction'"
    v-on:after:leave="resetForm()">
    <template #body>
      <UForm ref="form" :schema="schema" :state="state" @submit.prevent="saveTransaction" :validate-on="[]"
        class="space-y-4">
        <UFormField :required="true" label="Transaction Type" name="type">
          <UInputMenu :items="types" v-model="state.type" :disabled="isEditing"
            placeholder="Select Transaction Type" color="neutral" class="w-full" />
        </UFormField>
        <UFormField :required="true" label="Amount" name="amount">
          <UInput type="number" v-model.number="state.amount"
            placeholder="Amount" color="neutral" class="w-full" />
        </UFormField>
        <UFormField :required="true" label="Transaction Date" name="created_at">
          <UInput type="date" v-model="state.created_at"
            icon="i-heroicons-calendar-days-20-solid" color="neutral" class="w-full" />
        </UFormField>
        <UFormField :required="false" label="Description" name="description">
          <UInput type="string" v-model="state.description"
            placeholder="Description" color="neutral" class="w-full" />
        </UFormField>
        <UFormField :required="true" label="Category" name="category" v-if="state.type === 'Expense'">
          <UInputMenu :items="categories" v-model="state.category"
            placeholder="Select Category" color="neutral" class="w-full" />
        </UFormField>
        <UButton type="submit" :loading="isLoading" color="neutral">
          {{ isEditing ? 'Save Changes' : 'Add Transaction' }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { z } from 'zod'
import { types, categories } from '~/constants'

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false
  }
})
const isEditing = computed(() => !!props.transaction)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const toast = useAppToast()
const emit = defineEmits(['saved'])

const saveTransaction = async () => {
  if (form.value.errors.length) return

  isLoading.value = true
  try {
    const { error } = await supabase.from('transactions')
    .upsert({
      ...state.value,
      id: props.transaction?.id
    })

    if (!error) {
      toast.success({
        title: 'Succeeded to add transaction'
      })
      emit('saved')
      return
    }
    throw error
  } catch (e) {
    toast.error({
        title: 'Failed to add transaction'
      })
  } finally {
    isLoading.value = false
  }
}

const defaultSchema = z.object ({
  amount: z.number().positive('Amount needs to be more than 0'),
  created_at: z.string().date(),
  description: z.string().optional()
})

const incomeSchema = z.object({
  type: z.literal('Income')
})

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories)
})

const investmentSchema = z.object({
  type: z.literal('Investment')
})

const savingSchema = z.object({
  type: z.literal('Saving')
})

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema
)

const initialState = isEditing.value ? {
  type: props.transaction.type,
  amount: props.transaction.amount,
  created_at: props.transaction.created_at.split('T')[0],
  description: props.transaction.description,
  category: props.transaction.category
} : {
  type: undefined,
  amount: undefined,
  created_at: undefined,
  description: undefined,
  category: undefined
}

const state = ref({ ...initialState })

const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}

</script>
