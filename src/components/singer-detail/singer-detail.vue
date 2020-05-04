<template>
  <transition name="slide">
    <!-- 调用music-list组件 -->
    <!-- 要传入三个数据给这个子组件 -->
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'


  export default {
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      // 从state中取出数据
     ...mapGetters([
      //  对应的是store里的getters里的singer
       'singer'
     ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      // console.log(this.singer)
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 用户刷新没有singerID直接回退到页面
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        // 传入singerId
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
            // 这里已经正确抓取到转换为需要的数据结构的数组了
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      // 初始化song的数据结构
      _normalizeSongs(list) {
        let ret = []
        // 遍历list,得到item
        list.forEach((item) => {
          // 拿到了每一个musciData
          let {musicData} = item
          if(musicData.songid && musicData.albummid) {
            // 创建了一个song的实例
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
       MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"

 .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>