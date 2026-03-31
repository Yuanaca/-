<script setup lang="ts">
import { useGuessList } from '@/composables'
import { getPayMockStatusAPI, postPayMockConfirmAPI, type MockPayResult } from '@/services/pay'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

// 获取页面参数
const query = defineProps<{
  id: string
}>()

// 猜你喜欢
const { guessRef, onScrolltolower } = useGuessList()

const payInfo = ref<MockPayResult>()
const loading = ref(false)
const confirming = ref(false)

const isPaid = computed(() => payInfo.value?.paid)
const statusText = computed(() => {
  if (!payInfo.value) return '支付状态加载中'
  return payInfo.value.payStateDesc
})

const loadPayStatus = async () => {
  loading.value = true
  try {
    const res = await getPayMockStatusAPI({ orderId: query.id })
    payInfo.value = res.result
  } finally {
    loading.value = false
  }
}

const onConfirmPay = async () => {
  if (!payInfo.value?.canConfirm || confirming.value) return
  confirming.value = true
  try {
    const res = await postPayMockConfirmAPI({ orderId: query.id, success: true })
    payInfo.value = res.result
    uni.showToast({ title: '支付成功', icon: 'success' })
  } finally {
    confirming.value = false
  }
}

const onRefresh = async () => {
  await loadPayStatus()
  uni.showToast({ title: '状态已更新', icon: 'none' })
}

onLoad(() => {
  loadPayStatus()
})
</script>

<template>
  <scroll-view class="viewport" scroll-y @scrolltolower="onScrolltolower">
    <!-- 订单状态 -->
    <view class="overview" :class="{ success: isPaid, pending: !isPaid }">
      <view class="status" :class="isPaid ? 'icon-checked' : 'icon-clock'">
        {{ isPaid ? '支付成功' : '待确认支付' }}
      </view>
      <view class="desc">{{ statusText }}</view>

      <view class="order-info" v-if="payInfo">
        <view class="row">
          <text>订单号</text>
          <text>{{ payInfo.orderNo || query.id }}</text>
        </view>
        <view class="row">
          <text>应付金额</text>
          <text>¥ {{ Number(payInfo.payAmount || 0).toFixed(2) }}</text>
        </view>
        <view class="row">
          <text>支付通道</text>
          <text>{{ payInfo.payChannel }}</text>
        </view>
      </view>

      <view v-if="loading" class="loading">正在获取支付状态...</view>

      <view class="buttons">
        <view v-if="payInfo?.canConfirm && !isPaid" class="button action" @tap="onConfirmPay">
          {{ confirming ? '确认中...' : '确认支付' }}
        </view>
        <view class="button ghost" @tap="onRefresh">刷新状态</view>
        <navigator
          hover-class="none"
          class="button ghost navigator"
          url="/pages/index/index"
          open-type="switchTab"
        >
          返回首页
        </navigator>
        <navigator
          hover-class="none"
          class="button ghost navigator"
          :url="`/pagesOrder/detail/detail?id=${query.id}`"
          open-type="redirect"
        >
          查看订单
        </navigator>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef" />
  </scroll-view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  line-height: 1;
  padding: 50rpx 0;
  color: #fff;
  background: linear-gradient(135deg, #1ca57f, #32c7a0);

  &.pending {
    background: linear-gradient(135deg, #f39b2b, #f5b24a);
  }

  .status {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }

  .status::before {
    display: block;
    font-size: 110rpx;
    margin-bottom: 20rpx;
  }

  .desc {
    margin-top: 10rpx;
    text-align: center;
    font-size: 24rpx;
    opacity: 0.95;
  }

  .order-info {
    margin: 28rpx 28rpx 0;
    padding: 24rpx;
    border-radius: 16rpx;
    background-color: rgba(255, 255, 255, 0.14);

    .row {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      margin-top: 14rpx;
    }

    .row:first-child {
      margin-top: 0;
    }
  }

  .loading {
    margin-top: 20rpx;
    text-align: center;
    font-size: 24rpx;
    opacity: 0.9;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
    gap: 16rpx;
  }

  .button {
    text-align: center;
    min-width: 200rpx;
    line-height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border-radius: 64rpx;
    color: #fff;
    border: 1rpx solid rgba(255, 255, 255, 0.9);
  }

  .button.action {
    background-color: #fff;
    color: #1ca57f;
    border-color: #fff;
  }

  &.pending .button.action {
    color: #e48c18;
  }

  .button.ghost {
    background-color: transparent;
  }
}
</style>
