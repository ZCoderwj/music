<template>
  <scroll class="listview" 
          :data="data" 
          ref="listview" 
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType=3>
    <!-- 遍历从父组件得到的singer对象。热门，列表 -->
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <!-- selectItem,子路由跳转事件 -->
          <li v-for="item in group.items" class="list-group-item"
              @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧绝对定位的快速入口 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <!-- 遍历title的集合数组 -->
        <li v-for="(item,index) in shortCutList" 
            class="item" 
            :data-index="index"
            :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 滚动固定标题 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  // 每一个锚点的高度
  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18

  export default {
    created() {
      this.probeType = 3
      this.listenScroll = true
      // 并不需要观测touch的变化，所以不用写到data中
      this.touch = {}
      this.listHeight = []
    },
    data() {
      // 需要观测的数据
      return {
        // 观测一个实时滚动的位置
        scrollY: -1,
        // 当前应该显示的是第几个,currentIndex对应到那个，那个就是高亮
        currentIndex:0
      }
    },
    props: {
      // 从父组件传过来的处理完毕的singer值
      data: {
        type:Array,
        default:[],
        // 上限-scrollY的差值，如果这个插值小于这个高度，就让他往上顶
        diff: -1
      }
    },
    // 使用vue的计算属性computed,获得右侧快速入口的计算列表
    computed: {
      // 拿到title的一个集合数组
      shortCutList() {
        // 对props传过来的data数组使用数组元素的map方法
        return this.data.map((group) => {
          // 拿到group.title.subste，截取一个字
          return group.title.substr(0,1)
        })
      },
      fixedTitle() {
        // 边界条件的判断
        if (this.scrollY > 0) {
          return ''
        }
        // 如果有data的话，在去取它的title,没有的话就取空
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) {
        // 把事件派发出去，告诉外部我被点击了，以及被谁点击了
        this.$emit('select', item)
      },
      // 第一个参数是element
      onShortcutTouchStart(e) {
        // dom.js中定义的getData方法，得到data-index（索引值）
        // anchor:锚点的index
        // e.target不冒泡就是指向事件触发的dom。获取事件触发元素id
        let anchorIndex = getData(e.target, 'index')
        //  获取你第一个手指一开始的位置
        let firstTouch = e.touches[0]
        // 保存firstTouch它的pageY属性，表示它touch的位置
        // 触点相对于HTML文档上边沿的的Y坐标，这个值包含了垂直滚动的偏移
        this.touch.y1 = firstTouch.pageY
        //  记录一开始点的锚点是第几个索引
        this.touch.anchorIndex = anchorIndex
        // 被封装的方法
        this._scrollTo(anchorIndex)
      },
      // 监听滑动事件
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        // 滑动中得到的y2,偏移的距离
        this.touch.y2 = firstTouch.pageY
        // 移动的位置-原来的位置 ，y轴上的偏移（delta:偏移了几个锚点）
        // 
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // this.touch.anchorIndex取来的原本是个字符串
        // 用parseInt转化为整型数字
        // 这里的锚点就等于上面的锚点+锚点的偏移量（delta）
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        // 被封装的方法
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        // 通过scroll事件得到better-scroll实时滚动的yz轴的距离
        this.scrollY = pos.y
      },
      // 封装了_scrollTo方法,去实现滑动和点击跳转
      _scrollTo(index) {
        // index是null的情况
        if(!index && index!==0 ){
          return
        }
        // 处理index的边界情况
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 我们要手动设置ScrollY的值
        // 每个listHeight的上限的位置
        this.scrollY = -this.listHeight[index]
      // 第二个参数的含义:要不要有一个函数的动画时间
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 私有方法，计算每一个group的宽度
      _calculateHeight() {
        this.listHeight = []
        // 拿到列表的对象
        const list = this.$refs.listGroup
        // 初始height为0
        let height = 0 
        // 第一个元素的高度为0
        this.listHeight.push(height)
        // 要遍历listgtoup，得到每个元素的高度
        for(let i=0;i<list.length; i++) {
          // 得到每一个group的元素，就是一个item
          let item = list[i]
          // height
          height+= item.clientHeight
          // 得到从第一个到最后一个，每一个group元素所对应的height
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      // 监听data发生变化，延时去计算group的宽度
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 要将scrollY和listheight做一个对比
      scrollY(newY) {
        // 引用listHeight
        const listHeight = this.listHeight
        // 第一种情况：当滚动到顶部，newY>0
        if (newY > 0) {
          // 第一个元素是高亮的
          this.currentIndex = 0
          return
        }
        // 第二种情况：在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          // 下限
          let height1 = listHeight[i]
          // 上限
          let height2 = listHeight[i + 1]
          // 向上滚动的时候，Y值是一个负值
          // -newY大于下限同时-newY下雨下限
          if (-newY >= height1 && -newY < height2) {
            // this.currentindex=这个i
            this.currentIndex = i
            // diff= 上限 + （-newY）
            this.diff = height2 + newY
            return
          }
        }
        // 第三种情况：当滚动到底部，且-newY大于最后一个元素的上限
        // listheight比右侧的元素多一个
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>