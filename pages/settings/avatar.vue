<template>
  <UForm :state="state" @submit.prevent="saveAvatar" class="space-y-4">
    <UFormField label="Current avatar" help="This would be blank by default">
      <UAvatar :src="url" class="w-32 h-32 m-4" />
    </UFormField>
    <UFormField required label="New avatar" name="avatar"
      help="After choosing an image click Save to actually upload the new avatar">
      <UInput required type="file" ref="inputRef" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Save Changes" color="neutral" :loading="uploading" :disabled="uploading"/>
  </UForm>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
// We need to get the actual avatar URL
const toast = useAppToast()
const { url } = useAvatarUrl()

const uploading = ref(false)
const fileInput = useTemplateRef('inputRef')

const state = ref({
  avatar: null
})

const saveAvatar = async () => {
  const file = fileInput.value.inputRef.files[0]
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.value.id}.${fileExt}`

  try {
    uploading.value = true
    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value.user_metadata?.avatar_url

    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)
    if (error) throw error
    
    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })

    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) throw error
    }

    // 5. Reset the file input
    fileInput.value.inputRef.files = null

    toast.success({
      title: 'Succeeded to update your avatar',
    })
  } catch (error) {
    toast.error({
      title: 'Failed to update your avatar',
      description: error.message
    })
  } finally {
    uploading.value = false
  }
}

console.log(url.value)

useHead({
  title: 'Avatar'
})
</script>
