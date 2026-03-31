<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'

const activeIndex = ref(0)
const DEFAULT_IMAGE = '/static/images/blank.png'
const brokenMap = ref<Record<string, boolean>>({})

const onChange: UniHelper.SwiperOnChange = (ev) => {
  //!非空断言，主动排除了undefined情况
  activeIndex.value = ev.detail!.current
}

const getBannerImage = (item: BannerItem) => {
  const key = String(item.id)
  if (brokenMap.value[key]) {
    return DEFAULT_IMAGE
  }
  return item.imgUrl || DEFAULT_IMAGE
}

const onBannerImageError = (id: string | number) => {
  brokenMap.value[String(id)] = true
}

defineProps<{
  list: BannerItem[]
}>()
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image
            mode="aspectFill"
            class="image"
            :src="getBannerImage(item)"
            @error="onBannerImageError(item.id)"
          ></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
@import '@/components/styles/XtxSwiper.scss';
</style>
