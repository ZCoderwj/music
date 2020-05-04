<template>
  <div class="tab">
    <!-- tag属性：渲染为div标签 -->
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    // flex布局
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
    //   flex-grow: 1;flex-shrink: 1;flex-basis: 1;
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      // 当前的router被激活的时候，添加的class
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>