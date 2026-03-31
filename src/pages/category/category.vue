<script setup lang="ts">
import { getCategoryTopAPI } from '@/services/category'
import { getHomeBannerAPI } from '@/services/home'
import type { CategoryTopItem } from '@/types/category'
import type { BannerItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { nextTick, ref } from 'vue'
import PageSkeleton from './comphoents/PageSkeleton.vue'

//获取轮播图数据
const bannerList = ref<BannerItem[]>([])
const getBannerData = async () => {
  const res = await getHomeBannerAPI(2)
  bannerList.value = res.result
}

//获取分类列表数据
const categoryList = ref<CategoryTopItem[]>([])
const activeIndex = ref(0)
const sectionTops = ref<number[]>([])
const scrollIntoViewId = ref('')
const DEFAULT_IMAGE = '/static/images/blank.png'

const getGoodsImage = (goods: { picture?: string }) => {
  return goods.picture || DEFAULT_IMAGE
}

const onGoodsImageError = (goods: { picture?: string }) => {
  goods.picture = DEFAULT_IMAGE
}

const getCategoryTopData = async () => {
  const res = await getCategoryTopAPI()
  categoryList.value = res.result
}

const calcSectionTops = () => {
  const query = uni.createSelectorQuery()
  query.select('.secondary').boundingClientRect()
  query.selectAll('.category-anchor').boundingClientRect()
  query.exec((result) => {
    const secondaryRect = result?.[0] as UniApp.NodeInfo | undefined
    const anchors = (result?.[1] as UniApp.NodeInfo[]) || []
    if (!secondaryRect || !anchors.length) {
      sectionTops.value = []
      return
    }
    sectionTops.value = anchors.map((item) => (item.top || 0) - (secondaryRect.top || 0))
  })
}

const syncActiveByScrollTop = (scrollTop: number) => {
  if (!sectionTops.value.length) return
  let idx = 0
  for (let i = 0; i < sectionTops.value.length; i += 1) {
    if (scrollTop + 8 >= sectionTops.value[i]) {
      idx = i
    } else {
      break
    }
  }
  activeIndex.value = idx
}

const onSecondaryScroll: UniHelper.ScrollViewOnScroll = (ev) => {
  if (!sectionTops.value.length) {
    calcSectionTops()
  }
  syncActiveByScrollTop(ev.detail.scrollTop)
}

const onPrimaryTap = (index: number) => {
  activeIndex.value = index
  scrollIntoViewId.value = `cat-${categoryList.value[index].id}`
  setTimeout(() => {
    scrollIntoViewId.value = ''
  }, 260)
}

//是否数据加载完毕
const isFinish = ref(false)
//页面加载
onLoad(async () => {
  await Promise.all([getBannerData(), getCategoryTopData()])
  isFinish.value = true

  await nextTick()
  calcSectionTops()
  setTimeout(() => calcSectionTops(), 300)
})
</script>

<template>
  <view class="viewport" v-if="isFinish">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">找饮品</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="onPrimaryTap(index)"
        >
          <text class="name">{{ item.name }}</text>
        </view>
      </scroll-view>
      <!-- 右侧：全部分类内容 -->
      <scroll-view
        class="secondary"
        scroll-y
        :scroll-into-view="scrollIntoViewId"
        @scroll="onSecondaryScroll"
      >
        <!-- 焦点图 -->
        <XtxSwiper class="banner" :list="bannerList" />
        <view
          class="category-anchor"
          v-for="(category, cIndex) in categoryList"
          :key="category.id"
          :id="`cat-${category.id}`"
        >
          <view class="panel" v-for="item in category.children" :key="item.id">
            <view class="title">
              <text class="name">{{ item.name }}</text>
              <navigator class="more" hover-class="none">全部</navigator>
            </view>
            <view class="section">
              <navigator
                v-for="goods in item.goods"
                :key="goods.id"
                class="goods-card"
                hover-class="none"
                :url="`/pages/goods/goods?id=${goods.id}`"
              >
                <image
                  class="cover"
                  :src="getGoodsImage(goods)"
                  @error="onGoodsImageError(goods)"
                ></image>
                <view class="meta">
                  <view class="name ellipsis">{{ goods.name }}</view>
                  <view class="desc ellipsis">{{ goods.desc || '奶香清爽，一口就爱上' }}</view>
                  <view class="price">
                    <text class="symbol">¥</text>
                    <text class="number">{{ goods.price }}</text>
                  </view>
                </view>
                <view class="add">+</view>
              </navigator>
              <view v-if="!item.goods?.length" class="empty-tip">该分类暂无饮品</view>
            </view>
          </view>
          <view v-if="cIndex !== categoryList.length - 1" class="section-divider"></view>
        </view>
      </scroll-view>
    </view>
  </view>
  <PageSkeleton v-else />
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 0 24rpx 16rpx;
  background-color: #fff;

  .input {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 24rpx;
    color: #8e8e93;
    font-size: 26rpx;
    border-radius: 34rpx;
    background-color: #f3f4f6;
  }
}

.icon-search {
  &::before {
    margin-right: 10rpx;
  }
}

.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}

.primary {
  overflow: hidden;
  width: 168rpx;
  flex: none;
  background-color: #efefef;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100rpx;
    font-size: 26rpx;
    color: #53565e;
    position: relative;
    padding: 0 12rpx;

    .name {
      text-align: center;
    }

    &::after {
      content: '';
      position: absolute;
      left: 24rpx;
      right: 24rpx;
      bottom: 0;
      border-top: 1rpx solid #dfdfe2;
    }
  }

  .active {
    background-color: #fff;
    color: #222;
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 16rpx;
      width: 6rpx;
      height: 68rpx;
      border-radius: 0 6rpx 6rpx 0;
      background-color: #23c9ad;
    }
  }
}

.primary .item:last-child::after,
.primary .active::after {
  display: none;
}

.secondary {
  flex: 1;
  background-color: #fff;

  .banner {
    height: 210rpx;
    margin: 0 20rpx 18rpx;
    border-radius: 12rpx;
    overflow: hidden;
  }

  .panel {
    margin: 0 20rpx;
    padding-bottom: 8rpx;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56rpx;
    color: #2d2d2d;
    border-bottom: 1rpx solid #f1f2f4;

    .name {
      font-size: 30rpx;
      font-weight: 600;
    }

    .more {
      font-size: 24rpx;
      color: #8a8a8f;
    }
  }

  .more::after {
    font-family: 'erabbit' !important;
    content: '\\e6c2';
    margin-left: 4rpx;
  }

  .section {
    padding: 16rpx 0 10rpx;
  }

  .goods-card {
    display: flex;
    align-items: center;
    padding: 14rpx 0;
    border-bottom: 1rpx solid #f3f3f5;

    .cover {
      width: 126rpx;
      height: 126rpx;
      border-radius: 12rpx;
      background: #f5ede8;
      flex: none;
    }

    .meta {
      margin-left: 16rpx;
      min-width: 0;
      flex: 1;
    }

    .name {
      font-size: 30rpx;
      color: #232323;
      font-weight: 600;
      line-height: 1.2;
    }

    .desc {
      margin-top: 8rpx;
      font-size: 23rpx;
      color: #8d8d93;
    }

    .price {
      margin-top: 10rpx;
      color: #1f1f1f;
      font-size: 22rpx;

      .number {
        margin-left: 2rpx;
        font-size: 32rpx;
        color: #111;
        font-weight: 700;
      }
    }

    .add {
      width: 44rpx;
      height: 44rpx;
      line-height: 44rpx;
      text-align: center;
      font-size: 34rpx;
      color: #fff;
      border-radius: 50%;
      background: #ff3b30;
      margin-left: 12rpx;
      flex: none;
    }
  }

  .goods-card:last-child {
    border-bottom: none;
  }

  .empty-tip {
    color: #999;
    font-size: 24rpx;
    padding: 20rpx 0;
    text-align: center;
  }

  .section-divider {
    height: 18rpx;
    background-color: #f7f7f8;
    margin-top: 8rpx;
  }
}
</style>
