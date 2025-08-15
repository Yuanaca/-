import type { OrderCreateParams, OrderPreResult } from '@/types/order'
import { http } from '@/utils/http'
//填写订单-获取预付订单
export const getMemberOrderPreAPI = () => {
  return http<OrderPreResult>({
    url: '/member/order/pre',
    method: 'GET',
  })
}

//立即购买订单
export const getMemberOrderPreNowAPI = (data: {
  skuId: string
  count: string
  addressId?: string
}) => {
  return http<OrderPreResult>({
    url: '/member/order/pre/now',
    method: 'GET',
    data,
  })
}
//提交订单
export const postMemberOrderAPI = (data: OrderCreateParams) => {
  return http<{ id: string }>({
    method: 'POST',
    url: '/member/order',
    data,
  })
}
