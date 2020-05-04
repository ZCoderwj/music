<template>
  <div id="app">
    <!-- 使用头部组件 -->
    <m-header></m-header>
    <!-- tabbar切换 -->
    <tab></tab>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    <!-- 进行操作，并不会影响播放器的播放，所以不是和路由相关的，定义到APP.VUE下 -->
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  // import 'common/stylus/index.styl'
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>