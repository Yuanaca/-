import type { PageResult } from './global'

export type SeckillItem = {
  id: string
  productId: string
  title: string
  mainImage: string
  originalPrice: number
  seckillPrice: number
  stock: number
  soldCount: number
  startTime: string
  endTime: string
  status?: 0 | 1 | 2
}

export type SeckillHomeResult = {
  list: SeckillItem[]
}

export type SeckillPageResult = PageResult<SeckillItem>
