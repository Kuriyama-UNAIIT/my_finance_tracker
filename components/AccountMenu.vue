<template>
  <UDropdownMenu v-if="user" :items="items", :ui="{
    item: { disabled: 'cursor-text select-text' },
    content: 'w-64'
  }">
    <UAvatar :src="url" alt="Avatar" />
    <template #account="{ item }">
      <div class="text-left">
        <p>
          Signed in as 
        </p>
        <p class="font-medium text-neutral">
          {{ user.email }}
        </p>
      </div>
    </template>
    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>
      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-muted ms-auto" />
    </template>
  </UDropdownMenu>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { url } = useAvatarUrl()
const items = [
  [{
    slot: 'account',
    disabled: false
  }],[{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    onClick: () => navigateTo('/settings/profile')
  }, {
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    onClick: async () => {
      await supabase.auth.signOut()
      return navigateTo('/login')
    }
  }]
]
</script>
