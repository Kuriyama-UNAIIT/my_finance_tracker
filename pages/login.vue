<template>
  <UCard v-if="!success">
    <template #header>
      Sign-in to Finance Tracker
    </template>
    <UForm :ref="form" :schema="schema" :state="state" @submit.prevent="handleLogin" :validate-on="[]" class="space-y-4">
      <UFormField required label="Email" name="email" help="You will receive an email with the confirmation link">
        <UInput required type="email" v-model="state.email" placeholder="Email" class="w-full" />
      </UFormField>
      <UButton type="submit" :loading="pending" :disabled="pending" color="neutral">
        Sign in
      </UButton>
    </UForm>
  </UCard>
  <UCard v-else>
    <template #header>
      Email has been sent
    </template>
    <div class="text-center space-y-4">
      <p>We have sent an email to <strong>{{ state.email }}</strong> with a link to sign-in.</p>
      <p>
        <strong>Important:</strong> The link will expire in 5 minutes.
      </p>
    </div>
  </UCard>
</template>

<script setup>
import { z } from 'zod'

const form = ref()
const success = ref(false)
const pending = ref(false)
const supabase = useSupabaseClient()
const toast = useAppToast()
const redirectUrl = useRuntimeConfig().public.baseUrl

useRedirectIfAuthenticated()

const schema = z.object({
  email: z.string().email()
})

const state = ref({
  email: undefined
})

const handleLogin = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: state.value.email,
      options: {
        emailRedirectTo: `${redirectUrl}/confirm`
      }
    })
    if (error) {
      toast.error({
        title: 'Authentication failed',
        description: error.message
      })
    } else {
      success.value = true
    }
  } finally {
    pending.value = false
  }
}

useHead({
  title: 'Login'
})
</script>
