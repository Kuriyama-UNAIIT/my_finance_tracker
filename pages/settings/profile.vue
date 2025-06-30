<template>
  <UForm :schema="schema" :state="state" @submit.passive="saveProfile" class="space-y-4">
    <UFormField label="Full Name" name="name">
      <UInput type="string" v-model="state.name"
        placeholder="Full Name" color="neutral" class="w-full"
      />
    </UFormField>
    <UFormField required label="Email" name="email"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
    >
      <UInput type="email" v-model="state.email"
        placeholder="Email" color="neutral" class="w-full"
      />
    </UFormField>
    <UButton type="submit" label="Save Changes" color="neutral" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<script setup>
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useAppToast()

const pending = ref(false)

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email()
})

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email
})

const saveProfile = async () => {
  pending.value = true
  try {
    const data = {
      data: {
        full_name: state.value.name
      }
    }

    if (state.value.email !== user.value.email) {
      data.email = state.value.email
    }

    const { error } = await supabase.auth.updateUser(data)
    if (error) throw error

    toast.success({
      title: 'Succeeded to update your profile'
    })
  } catch (error) {
    toast.error({
      title: 'Failed to update your profile',
      description: error.message
    })
  } finally {
    pending.value = false
  }
}

useHead({
  title: 'Profile'
})
</script>
