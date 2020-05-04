<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    // 得到songs.因为他需要遍历这个数组的
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    methods: {
      // 得到歌曲名下面的哪一行字
      getDesc(song) {
        return `${song.singer}·${song.album}`
      },
      // 发送点击事件，派发给父组件
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>