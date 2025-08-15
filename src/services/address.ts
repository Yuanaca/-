import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'
import type { Ad } from '@uni-helper/uni-app-types'
//     添加收货地址
//     data请求参数
export const postMemberAddressAPI = (data: AddressParams) => {
  return http({
    url: '/member/address',
    method: 'POST',
    data,
  })
}

export const getMemberAddressAPI = () => {
  return http<AddressItem[]>({
    url: '/member/address',
    method: 'GET',
  })
}

//获取收获地址详情接口
//id 路径参数
export const getMemberAddressByIdAPI = (id: string) => {
  return http<AddressItem>({
    url: `/member/address/${id}`,
    method: 'GET',
  })
}

//修改收货地址
export const putMemberAddressByIdAPI = (id: string, data: AddressParams) => {
  return http({
    url: `/member/address/${id}`,
    method: 'PUT',
    data,
  })
}

//删除收货地址
export const deleteMemberAddressByIdAPI = (id: string) => {
  return http({
    url: `/member/address/${id}`,
    method: 'DELETE',
  })
}

//删除/清空购物车单品
export const deleteMemberCartItemAPI = (data: { ids: string[] }) => {
  return http({
    url: `/member/cart`,
    method: 'DELETE',
    data,
  })
}
