import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const deleteToken = () => {
      token.value = ''
    }
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      // console.log(res.data)
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    return { token, setToken, deleteToken, user, getUser, setUser }
  },
  {
    persist: true
  }
)
