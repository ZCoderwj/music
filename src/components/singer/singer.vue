<template>
 <div class="singer" >
   <!-- 使用list-view组件 -->
   <!-- 回调函数select -->
   <list-view :data="singers" @select="selectSinger"></list-view>
   <!-- 承载子路由 -->
   <router-view></router-view>
 </div>
</template>

<script type="text/ecmascript-6">
  // 导入获取数据的方法
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  // 导入singer类
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  // vuex语法糖，通过这个方法做一个映射
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10


  // 第一层数组：将所有歌手以姓名开头字母Findex——ABCD顺序排列
  // 第二层数组：在每一个字母歌手数组中，按顺序再将歌手进行排列
  // 热门数据：简单将前十条数据取出来
  export default {
    data() {
      return {
        singers: []
      }
    },
    components: {
      ListView
    },
    created() {
      // 获取数据
      this._getSingerList()
    },
    methods: {
      // 传过来的元素是singer实例
      selectSinger(singer) {
        // 跳转路由
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 完成commit提交，修改了state
        // 相当于往state中写入了东西
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERR_OK) {
            // console.log(res.data.list)
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      // 标准化singer
      // 一共两层，第一层是map,里面是a,b,c
      // 第二层是 map里面每一个对象的items[]
      // a的items里面放的a的数据，b的items里面放的b的数据
      _normalizeSinger(list) {
        // 构造map对象
        let map = {
          // 热门
          hot:{
            title: HOT_NAME ,
            items:[]
          }
        }
        // 遍历list
        list.forEach((item, index) => {
          // 前10条数据，push进数组
          if (index<HOT_SINGER_LEN) {
          // avatar需要的数据是通过id计算得到的，且重复多次，重复代码太多
          // 用面向对象的方法，创建一个Singer类
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,  //得到前10数组中的歌手名
              id: item.Fsinger_mid  //得到前10歌手中
            }))
          }
          // Findex，将姓氏聚类
          const key = item.Findex //Findex：姓氏
          //  map里有没有key这个对象，然后就新建一个map[key]对象
          if(!map[key]){
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        console.log(map)
        // 为了得到有序列表，需要处理map
        let hot = []  //热门
        let ret = []  //剩下的
        for(let key in map) {
          // 每一个元素，对应一个title和items
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)) {
            // 如果匹配到a-z A-Z就放到ret中
            ret.push(val)
            // 如果title是热门数据就push到hot里
          }else if(val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // sort方法，按字母升序排列
        ret.sort((a,b) => {
          // 这里通过charCodeAt方法获取title属性第一个字母的Unicode 值，然后排序。
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        // concat链接两个或多个数组
        return hot.concat(ret)
      },
      // 做一个映射，做完之后就可以调用this.setSinger了
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
