import Vue from 'vue'
import Router from 'vue-router'

// 导入组件
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  // 配置路由与组件的映射关系
  routes: [
    // 配置跟路径
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      component:Recommend
    },
    {
      path:'/singer',
      component:Singer,
      // 添加子路由
      children:[
        {
          // 以ID为变量，可以传入不同的id值
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/rank',
      component: Rank
    },
    {
      path:'/search',
      component:Search
    }
  ]
})
