import { http } from '@/utils/http'

export type MockPayResult = {
  orderId: string
  orderNo: string
  payAmount: number
  mockTradeNo: string
  payChannel: string
  payState: 'UNPAID' | 'PAID' | 'CANCELLED'
  payStateDesc: string
  paid: boolean
  canConfirm: boolean
  expireSeconds: number
  payTime: string
  paymentParams: WechatMiniprogram.RequestPaymentOption
}

//获取微信支付参数
export const getPayWxPayMiniPayAPI = (data: { orderId: string }) => {
  return http<WechatMiniprogram.RequestPaymentOption>({
    method: 'GET',
    url: '/pay/wxPay/miniPay',
    data,
  })
}

//模拟支付
export const getPayMockAPI = (data: { orderId: string }) => {
  return http<WechatMiniprogram.RequestPaymentOption>({
    method: 'GET',
    url: '/pay/mock',
    data,
  })
}

// 创建模拟支付单
export const postPayMockCreateAPI = (data: { orderId: string }) => {
  return http<MockPayResult>({
    method: 'POST',
    url: '/pay/mock',
    data,
  })
}

// 查询模拟支付状态
export const getPayMockStatusAPI = (data: { orderId: string }) => {
  return http<MockPayResult>({
    method: 'GET',
    url: '/pay/mock/status',
    data,
  })
}

// 确认模拟支付
export const postPayMockConfirmAPI = (data: { orderId: string; success?: boolean }) => {
  return http<MockPayResult>({
    method: 'POST',
    url: '/pay/mock/confirm',
    data,
  })
}
