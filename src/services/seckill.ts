import type { PageParams } from '@/types/global'
import type { SeckillHomeResult, SeckillItem, SeckillPageResult } from '@/types/seckill'
import { http } from '@/utils/http'

const mockSeckillItems: SeckillItem[] = [
  {
    id: 'sk-1001',
    productId: 'p-1001',
    title: '草莓芝士雪顶',
    mainImage:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    originalPrice: 22,
    seckillPrice: 12.9,
    stock: 200,
    soldCount: 67,
    startTime: '2026-03-31 09:00:00',
    endTime: '2026-04-01 23:59:59',
    status: 1,
  },
  {
    id: 'sk-1002',
    productId: 'p-1002',
    title: '青提波波冰',
    mainImage:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    originalPrice: 20,
    seckillPrice: 11.5,
    stock: 160,
    soldCount: 89,
    startTime: '2026-03-31 10:00:00',
    endTime: '2026-04-02 20:00:00',
    status: 1,
  },
  {
    id: 'sk-1003',
    productId: 'p-1003',
    title: '霸气葡萄桶',
    mainImage:
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    originalPrice: 26,
    seckillPrice: 15.8,
    stock: 120,
    soldCount: 110,
    startTime: '2026-03-31 08:00:00',
    endTime: '2026-03-31 23:00:00',
    status: 2,
  },
  {
    id: 'sk-1004',
    productId: 'p-1004',
    title: '杨枝甘露轻乳',
    mainImage:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    originalPrice: 24,
    seckillPrice: 13.6,
    stock: 180,
    soldCount: 33,
    startTime: '2026-04-01 08:00:00',
    endTime: '2026-04-03 21:00:00',
    status: 0,
  },
  {
    id: 'sk-1005',
    productId: 'p-1005',
    title: '桃桃乌龙奶盖',
    mainImage:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    originalPrice: 23,
    seckillPrice: 14.2,
    stock: 140,
    soldCount: 12,
    startTime: '2026-04-01 12:00:00',
    endTime: '2026-04-05 22:00:00',
    status: 0,
  },
]

const mockResult = <T>(result: T) => {
  return Promise.resolve({
    code: '200',
    msg: 'mock',
    result,
  })
}

/**
 * 首页秒杀数据（默认只展示部分）
 */
export const getHomeSeckillAPI = async (limit = 3) => {
  try {
    return await http<SeckillHomeResult>({
      method: 'GET',
      url: '/seckill-service/seckill/mini/home',
      data: { limit },
    })
  } catch (error) {
    return mockResult<SeckillHomeResult>({
      list: mockSeckillItems.slice(0, limit),
    })
  }
}

/**
 * 秒杀列表（查看更多）
 */
export const getSeckillPageAPI = async (data?: PageParams) => {
  const page = data?.page || 1
  const pageSize = data?.pageSize || 10

  try {
    return await http<SeckillPageResult>({
      method: 'GET',
      url: '/seckill-service/seckill/mini/page',
      data: {
        page,
        pageSize,
      },
    })
  } catch (error) {
    const start = (page - 1) * pageSize
    const items = mockSeckillItems.slice(start, start + pageSize)
    const pages = Math.max(1, Math.ceil(mockSeckillItems.length / pageSize))
    return mockResult<SeckillPageResult>({
      items,
      counts: mockSeckillItems.length,
      page,
      pageSize,
      pages,
    })
  }
}

export const seckillMockData = mockSeckillItems
