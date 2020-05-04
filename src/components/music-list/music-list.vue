<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 按钮 -->
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 要被推上去的层，操作transfrom滚动距离 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 由于scroll需要宽度，所以我们把songs传进去让他计算宽度 -->
    <scroll :probe-type="probeType"  
            :data="songs"
            :listen-scroll="listenScroll"
            @scroll="scroll"
             class="list" ref="list">
      <div  class="song-list-wrapper">
        <!-- 调用子组件 -->
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <!-- loading效果 -->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  // 封装的浏览器兼容性代码
  import {prefixStyle} from 'common/js/dom'
   import {mapActions} from 'vuex'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    // 从外部动态接收的数据
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default:[]
      },
      title: {
        type:String,
        default:''
      }
    },
    data() {
      return {
        // 滚动的值
        ScrollY: 0
      }
    },
    computed: {
      // 动态绑定class，得到传入的bgimage，头像
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    created() {
      // 向scroll组件里传入两个值，就可以实时监听滚动位置
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      // 可以直接拿到背景图的高度
        this.imageHeight = this.$refs.bgImage.clientHeight
      // 最小滚动距离，滚到顶部
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      // 一个直接是DOM，一个是Vue的实例，Vue实例上的$el属性才是DOM
      // ref 加在子组件上，用this.ref.name 获取到的是组件实例，可以使用组件的所有方法。
      // 设置SCROLL组件的top组，保证位置是正确得
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      scroll(pos) {
        // 得到y的位置
        this.ScrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      // 接收song-list子组件传过来的事件
        selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions([
        'selectPlay',
      ])
    },
    watch: {
      ScrollY(newY) {
        // 设置最大滚动量
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0 
      // 放大缩小变量
      let scale = 1
      // 模糊度变量
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      // this.$refs.layer.style['webkit-transform'] = `translate3d(0,${translateY}px,0)`
      // 计算比例的绝对值
      const percent = Math.abs(newY / this.imageHeight)
      // 向下拉的时候
      if (newY > 0) {
        // 计算scale
        scale = 1+percent
        zIndex = 10
      } else {
        blur = Math.min( 20*percent , 20)
      }
      // CSS渐进模糊效果
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // newY<this.minTransal 代表滚到了顶部
      if(newY< this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        // $(document)可以获得当前页面上下文
        // 例如： var a = 1; console.log('一共有'+a+'个鸡蛋！')
        // 那么现在你只要console.log(`一共有${a}个鸡蛋！`)
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        // 实时设置样式,在newY>this.minTransal的时候，要把样式设置回去
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
        // 下拉图片跟着放大的效果的实现
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        // 下面这句话不需要了
        // this.$refs.bgImage.style['webkit-transform'] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

 .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>