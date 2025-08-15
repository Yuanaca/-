import type { AddressItem } from '@/types/address'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressstore = defineStore('address', () => {
  const selectedAddress = ref<AddressItem>()
  const changeSelectedAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }
  return {
    selectedAddress,
    changeSelectedAddress,
  }
})
