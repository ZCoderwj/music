<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <!-- 创建一个@load -->
                <!-- 加上class="needsclick后fastclick就不会自动取消点击" -->
                <img :src="item.picUrl" @load="loadImage" class="needsclick"> 
              </a>
            </div> 
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60"  v-lazy="item.imgurl">
              </div>
              <div class="text">
                <!-- v-html 转义字符 -->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  //  导入方法
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  // 导入轮播图组件
  import Slider from 'base/slider/slider'
  // 导入滑动组件
  import Scroll from 'base/scroll/scroll'
  // 导入loading组件
   import Loading from 'base/loading/loading'

  export default {
    data() {
      return {
        // 得到抓取来的轮播图的数据
        recommends:[],
        // 得到抓取来的歌单列表的数据
        discList: []
      }
    },
    created() {
      // 1.调用_gestRecommand方法
      this._getRecommend()
      // 如果recommends在discList后出来，就会出现问题，划不到底部
      setTimeout(() => {
        this._getDiscList()
      },300)
    },
    // 把gestRecommand方法拿出来
    methods: {
      _getRecommend() {
        // 2.调用api/recommend中的getRecommand方法
        // 使用.then就可以获取发送来的数据了
        getRecommend().then((res) => {
          if(res.code === ERR_OK) {
            // 为5个抓取到的轮播图赋值给this.recommends
              this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
              this.discList = res.data.list
          }
        })
      },
      loadImage() {
        // 只要有一张图片加载了，都被撑开了，确保refresh一次
        // 设置标志位，确保逻辑只执行一次
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    }
    },
    components: {
      // 注册轮播图组件
      Slider,
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        // flex ，左侧固定，右侧自适应，经典布局
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>