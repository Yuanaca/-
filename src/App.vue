<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
// 字体图标
@import '@/styles/fonts.scss';

view,
navigator,
input,
scroll-view {
  box-sizing: border-box;
  font-family: 'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 两行省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

page {
  background: linear-gradient(180deg, #fff8f2 0%, #f6efe8 100%);
}
</style>
