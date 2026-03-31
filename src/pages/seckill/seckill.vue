<script setup lang="ts">
import { getSeckillPageAPI } from '@/services/seckill'
import type { SeckillItem } from '@/types/seckill'
import { onLoad } from '@dcloudio/uni-app'
import { onBeforeUnmount, ref } from 'vue'

const list = ref<SeckillItem[]>([])
const page = ref(1)
const pageSize = 10
const pages = ref(1)
const isLoading = ref(false)

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

const startTimer = () => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const parseTime = (value: string) => new Date(value.replace(/-/g, '/')).getTime()

const getStatusText = (item: SeckillItem) => {
  const start = parseTime(item.startTime)
  const end = parseTime(item.endTime)
  if (now.value < start) return '未开始'
  if (now.value >= end) return '已结束'
  return '进行中'
}

const getStatusClass = (item: SeckillItem) => {
  const text = getStatusText(item)
  if (text === '进行中') return 'status-running'
  if (text === '未开始') return 'status-pending'
  return 'status-ended'
}

const getRemainMs = (item: SeckillItem) => {
  const start = parseTime(item.startTime)
  const end = parseTime(item.endTime)
  if (now.value < start) return start - now.value
  if (now.value >= end) return 0
  return end - now.value
}

const formatRemain = (ms: number) => {
  if (ms <= 0) return '00:00:00'
  const seconds = Math.floor(ms / 1000)
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const loadData = async (refresh = false) => {
  if (isLoading.value) return
  if (!refresh && page.value > pages.value) return

  isLoading.value = true
  const targetPage = refresh ? 1 : page.value

  try {
    const res = await getSeckillPageAPI({ page: targetPage, pageSize })
    const result = res.result
    pages.value = result.pages || 1

    if (refresh) {
      list.value = result.items || []
      page.value = 2
    } else {
      list.value.push(...(result.items || []))
      page.value += 1
    }
  } finally {
    isLoading.value = false
  }
}

const onScrolltolower = () => {
  loadData()
}

const onPullDownRefresh = async () => {
  await loadData(true)
  uni.stopPullDownRefresh()
}

onLoad(async () => {
  uni.setNavigationBarTitle({ title: '秒杀专区' })
  startTimer()
  await loadData(true)
})

const defaultImage = '/static/images/blank.png'
const getImage = (item: SeckillItem) => item.mainImage || defaultImage
const onImageError = (item: SeckillItem) => {
  item.mainImage = defaultImage
}

const toGoods = (item: SeckillItem) => {
  uni.navigateTo({ url: `/pages/goods/goods?id=${item.productId}` })
}
</script>

<template>
  <scroll-view
    class="viewport"
    scroll-y
    @scrolltolower="onScrolltolower"
    refresher-enabled
    @refresherrefresh="onPullDownRefresh"
  >
    <view class="tips">每日限时，倒计时结束后商品会自动恢复原价</view>

    <view class="card" v-for="item in list" :key="item.id" @tap="toGoods(item)">
      <image class="thumb" mode="aspectFill" :src="getImage(item)" @error="onImageError(item)" />
      <view class="info">
        <text class="name">{{ item.title }}</text>
        <view class="price-row">
          <text class="sale">¥{{ item.seckillPrice }}</text>
          <text class="origin">¥{{ item.originalPrice }}</text>
        </view>
        <view class="meta-row">
          <text class="status" :class="getStatusClass(item)">{{ getStatusText(item) }}</text>
          <text class="countdown">{{ formatRemain(getRemainMs(item)) }}</text>
        </view>
      </view>
    </view>

    <view class="loading-text">{{ page > pages ? '没有更多秒杀商品了' : '上拉加载更多' }}</view>
  </scroll-view>
</template>

<style lang="scss">
page {
  background: #f6f4f2;
  height: 100%;
}

.viewport {
  height: 100%;
  padding: 20rpx;
  box-sizing: border-box;
}

.tips {
  background: linear-gradient(135deg, #ffe8d2 0%, #fff6ee 100%);
  color: #9b5e38;
  border-radius: 12rpx;
  font-size: 24rpx;
  padding: 16rpx 18rpx;
  margin-bottom: 16rpx;
}

.card {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 14rpx;
  margin-bottom: 14rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.thumb {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-right: 14rpx;
  background-color: #f5f5f5;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-size: 30rpx;
  color: #2c2c2c;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.sale {
  color: #d13020;
  font-size: 36rpx;
  font-weight: 700;
}

.origin {
  color: #999;
  font-size: 24rpx;
  text-decoration: line-through;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  font-size: 24rpx;
  color: #8a8a8a;
}

.status-running {
  color: #1a9f51;
}

.status-pending {
  color: #f29e1f;
}

.status-ended {
  color: #b34e4e;
}

.countdown {
  font-size: 24rpx;
  color: #fff;
  background-color: #c2511d;
  border-radius: 999rpx;
  padding: 6rpx 16rpx;
}

.loading-text {
  text-align: center;
  color: #888;
  font-size: 24rpx;
  padding: 24rpx 0 40rpx;
}
</style>
