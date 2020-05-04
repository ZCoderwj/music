<template>
  <div class="slider" ref="slider" >
    <div class="slider-group" ref="sliderGroup">
      <!-- 占位置 -->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    // 父组件通过props向子组件传递数据（Pass props）
    data() {
      return {
        dots: [],
        currentPageIndex:0
      }
    },
    props: {
      // 循环轮播
      loop: {
        type: Boolean,
        default: true
      },
      // 自动轮播
      autoPlay: {
        type:Boolean,
        default: true
      },
      // 间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    // mounted钩子函数一般是用来向后端发起请求拿到数据以后做一些业务处理
    mounted() {
      // 为了保证DOM成功渲染，加一个延时
      setTimeout(() => {
        this._setSliderWidth()
        // 小圆点
        this._initDots()
        this._initSlider()
        if(this.autoPlay) {
          this._play()
        }

        // 监听窗口改变事件,在事件的回调中进行判断
        window.addEventListener('resize', () => {
          if(!this.slider) {
            return
          }
          // 重新计算宽度
          this._setSliderWidth(true)
          // 宽度计算完之后，重新刷新slider
          this.slider.refresh()
        })
        // 浏览器的刷新通常是17ms一次
      },20)
    },
    methods: {
      // 初始化scroll
      // 设置Slider的宽度
      _setSliderWidth(isResize) {
        // 拿到它的children（共有多少个元素）
        this.children = this.$refs.sliderGroup.children

        let width = 0
        // 父元素的宽度=每张图片的图案库
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          // 得到每一个子元素
          let child = this.children[i]
          // 给每一个元素都添加slider-item样式
          addClass(child, 'slider-item')
          // 给每一个child设置一下他的宽度
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        // dots就是一个长度为5的数组
        this.dots = new Array(this.children.length)
      },
      // 初始化Slider
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX:true,
          scrollT:false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
          snapThreshold: 0.3,
          snapSpeed: 400,
        })
        // 每次滚动完毕，会派发一个scrollEnd事件
        this.slider.on('scrollEnd',()=> {
          // 通过betterscroll里面的getCurretnPage（）方法,pageX得到当前页
          let pageIndex = this.slider.getCurrentPage().pageX
          if(this.loop){
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex;

          if(this.autoPlay){
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if(this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          // 0是代表Y方向
          this.slider.goToPage(pageIndex,0,400)
        },this.interval)
      }
    },
    destroyed() {
      // 在组件销毁的时期，要记得把组件做一个清理
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>