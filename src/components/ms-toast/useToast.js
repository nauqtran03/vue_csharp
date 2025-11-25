import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const show = (options) => {
    const id = ++toastId
    const toast = {
      id,
      visible: true,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 3000
    }
    
    toasts.value.push(toast)
    
    if (toast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, toast.duration)
    }
    
    return id
  }

  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, title = '') => {
    return show({ type: 'success', message, title })
  }

  const error = (message, title = '') => {
    return show({ type: 'error', message, title })
  }

  const warning = (message, title = '') => {
    return show({ type: 'warning', message, title })
  }

  const info = (message, title = '') => {
    return show({ type: 'info', message, title })
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}
