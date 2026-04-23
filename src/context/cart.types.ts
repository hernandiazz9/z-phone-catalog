import type { ColorOption, Phone, StorageOption } from '@/services/phones.types'

export type CartItem = {
  key: string
  phoneId: string
  brand: string
  name: string
  imageUrl: string
  storageCapacity: string
  colorName: string
  colorHex: string
  unitPrice: number
  quantity: number
}

export type AddToCartInput = {
  phone: Pick<Phone, 'id' | 'brand' | 'name'>
  storage: StorageOption
  color: ColorOption
}

export type CartContextValue = {
  items: CartItem[]
  totalCount: number
  totalPrice: number
  isHydrated: boolean
  addItem: (input: AddToCartInput) => void
  removeItem: (key: string) => void
  incrementItem: (key: string) => void
  decrementItem: (key: string) => void
  clearCart: () => void
}
