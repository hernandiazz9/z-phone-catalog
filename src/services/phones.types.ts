export type PhoneListItem = {
  id: string
  brand: string
  name: string
  basePrice: number
  imageUrl: string
}

export type ColorOption = {
  name: string
  hexCode: string
  imageUrl: string
}

export type StorageOption = {
  capacity: string
  price: number
}

export type PhoneSpecs = {
  screen: string
  resolution: string
  processor: string
  mainCamera: string
  selfieCamera: string
  battery: string
  os: string
  screenRefreshRate: string
}

export type Phone = {
  id: string
  brand: string
  name: string
  description: string
  basePrice: number
  rating: number
  specs: PhoneSpecs
  colorOptions: ColorOption[]
  storageOptions: StorageOption[]
  similarProducts: PhoneListItem[]
}

export type ListPhonesArgs = {
  search?: string
  limit?: number
  offset?: number
}
