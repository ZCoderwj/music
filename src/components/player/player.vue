<template>
 <!--3个v-show：显示隐藏都会依赖到vuex中的数据  -->
 <!-- 列表中有数据的时候，就显示 -->
  <div class="player" v-show="playlist.length>0">
    <!-- 实现动画:transitio -->
    <transition name="normal" 
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景图 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 第一个区块：top -->
        <div class="top">
          <!-- 返回按钮 -->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!-- 标题(歌曲名称) -->
          <h1 class="title" v-html="currentSong.name"></h1>
          <!--副标题（歌手名称）  -->
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 第二个区块，middle:中部 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <!-- 唱片图片 -->
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <!-- 第三个区块,bottom -->
        <div class="bottom">
          <div class="operators">
            <!-- 左 -->
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <!-- 中 -->
            <div class="icon i-center">
              <i class="icon-play"></i>
            </div>
            <!-- 右 -->
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen"
           @click="open">
        <!-- 转动的小型唱片图片 -->
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <!-- 歌手名称，歌手名称 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 播放按钮 -->
        <div class="control">
        </div>
        <!-- 点开播放列表的按钮 -->
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- html audio方法、currentSong发生改变的时候，调用play方法 -->
    <audio :src="currentSong.url" ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  // 导入第三方库
  import animations from 'create-keyframe-animation'
  import { prefixStyle } from 'common/js/dom'
  
  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
       
      }
    },
    computed: {
      // actions改变，mutations改变，映射到这里了
      ...mapGetters([
        'currentIndex',
        //控制显示隐藏 
        'fullScreen',
        // 标志控制整个播放器的渲染
        'playlist',
        'currentSong'
      ])
    },
    created() {
    },
    methods: {
      // back方法实际上要把fullscreen设置为false
      back() {
       this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      // done执行的时候，就会跳到下一个钩子函数afterEnter
      enter(el, done) {
        // 写CSS3动画
        // 以中心点到中心点的位置偏移
        const {x,y,scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
             transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
             transform: `translate3d(0,0,0) scale(1)`
          }
        }
        // 注册animation
        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration: 400,
            // 缓动
            easing:'linear'
          }
        })
        // 调用
        animations.runAnimation(this.$refs.cdWrapper, 'move' ,done)
      },
      afterEnter() {
        // 取消注册
        animations.unregisterAnimation('move')
        // 清空样式
        this.$refs.cdWrapper.style.animation=''
      },
      leave(el, done) {
        // 从大往小了滚
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        // 获取目标需要运行的位置
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        const timer = setTimeout(done, 400)
        // 添加一个事件，监听tranistionend事件，执行完就执行回调函数
        this.$refs.cdWrapper.addEventListener('transitionend', () => {
          clearTimeout(timer)
          done()
        })
      },
      afterLeave() {
        // 清除样式
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      // 获取初始位置，和缩放尺寸
      _getPosAndScale() {
        // 小圆 宽40 左偏移40 下偏移30
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        // 大圆 上偏移 80 
        const paddingTop = 80
        // 大圆cd 容器的宽度
        const width = window.innerWidth * 0.8
        const scale = targetWidth/width
        const x = -(window.innerWidth/2 - paddingLeft) 
        const y = window.innerHeight - paddingTop - width/2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      })
    },
    watch: {
      // 监听currentSong的变化
      currentSong() {
        // 添加一个延时
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      }
    },
    components: {  
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
