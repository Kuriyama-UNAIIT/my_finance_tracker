export const useAppToast = () => {
  const toast = useToast()

  return {
    success: ({title, description = null}) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'success'
      })
    },
    error: ({title, description = null}) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
    }
  }
}
