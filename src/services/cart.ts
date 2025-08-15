import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'

//加入购物车
export const postMemberCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    url: '/member/cart',
    method: 'POST',
    data,
  })
}

//获取购物车列表

//获取购物车列表
export const getMemberCartAPI = () => {
  return http<CartItem[]>({
    url: '/member/cart',
    method: 'GET',
  })
}
//修改购物车单品
export const putMemberCartBySkuIdAPI = (
  skuId: string,
  data: { selected?: boolean; count?: number },
) => {
  return http({
    url: `/member/cart/${skuId}`,
    method: 'PUT',
    data,
  })
}

//购物车全选
export const putMemberCartSelectedAPI = (data: { selected: boolean }) => {
  return http({
    url: '/member/cart/selected',
    method: 'PUT',
    data,
  })
}
