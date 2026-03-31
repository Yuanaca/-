<script setup lang="ts">
import type { SeckillItem } from '@/types/seckill'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  list: SeckillItem[]
}>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const visibleList = computed(() => props.list || [])

const parseTime = (value: string) => {
  return new Date(value.replace(/-/g, '/')).getTime()
}

const getStatusText = (item: SeckillItem) => {
  const start = parseTime(item.startTime)
  const end = parseTime(item.endTime)
  if (now.value < start) return '即将开始'
  if (now.value >= end) return '已结束'
  return '进行中'
}

const getRemainMs = (item: SeckillItem) => {
  const start = parseTime(item.startTime)
  const end = parseTime(item.endTime)
  if (now.value < start) {
    return start - now.value
  }
  if (now.value >= end) {
    return 0
  }
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

const onViewMore = () => {
  uni.navigateTo({ url: '/pages/seckill/seckill' })
}

const toGoods = (item: SeckillItem) => {
  uni.navigateTo({ url: `/pages/goods/goods?id=${item.productId}` })
}

const defaultImage = '/static/images/blank.png'
const getImage = (item: SeckillItem) => item.mainImage || defaultImage
const onImageError = (item: SeckillItem) => {
  item.mainImage = defaultImage
}
</script>

<template>
  <view class="seckill-panel">
    <view class="panel-head">
      <view class="title-wrap">
        <text class="title">限时秒杀</text>
        <text class="sub-title">爆款直降，倒计时结束自动下架</text>
      </view>
      <text class="more" @tap="onViewMore">查看更多 ></text>
    </view>

    <view class="seckill-list">
      <view class="seckill-item" v-for="item in visibleList" :key="item.id" @tap="toGoods(item)">
        <image class="thumb" :src="getImage(item)" mode="aspectFill" @error="onImageError(item)" />
        <view class="info">
          <text class="name ellipsis">{{ item.title }}</text>
          <view class="price-line">
            <text class="sale">¥{{ item.seckillPrice }}</text>
            <text class="origin">¥{{ item.originalPrice }}</text>
          </view>
          <view class="countdown-line">
            <text class="status">{{ getStatusText(item) }}</text>
            <text class="countdown">{{ formatRemain(getRemainMs(item)) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.seckill-panel {
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #fff3e6 0%, #fff 65%);
  box-shadow: 0 8rpx 24rpx rgba(198, 106, 60, 0.12);

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18rpx;
  }

  .title {
    font-size: 34rpx;
    color: #c2511d;
    font-weight: 600;
  }

  .sub-title {
    margin-left: 12rpx;
    font-size: 22rpx;
    color: #9c7a68;
  }

  .more {
    font-size: 24rpx;
    color: #a85b32;
  }

  .seckill-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .seckill-item {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    padding: 14rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
  }

  .thumb {
    width: 148rpx;
    height: 148rpx;
    border-radius: 12rpx;
    margin-right: 16rpx;
    background: #f5f5f5;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .name {
    font-size: 28rpx;
    color: #2f2f2f;
    max-width: 490rpx;
  }

  .price-line {
    display: flex;
    align-items: baseline;
    gap: 12rpx;
  }

  .sale {
    font-size: 34rpx;
    color: #d42b16;
    font-weight: 700;
  }

  .origin {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
  }

  .countdown-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status {
    font-size: 22rpx;
    color: #8d6f5c;
  }

  .countdown {
    font-size: 24rpx;
    color: #fff;
    background-color: #c2511d;
    border-radius: 999rpx;
    padding: 6rpx 18rpx;
  }
}
</style>
