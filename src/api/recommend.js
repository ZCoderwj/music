import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

// 封装一个抓取轮播图数据的方法
// 3.使用jsonp抓取数据得到data,发送JSONP的请求
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // data是拼接到URL后的数据
  // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
  const data = Object.assign({},commonParams, {
    // 请求自由的参数,复制到data
    platform:'h2',
    uin:0,
    needNewCode: 1
  })
  // 发送JSONP的请求
  return jsonp(url, data, options)
}

// 封装了请求歌单列表的数据的方法。
export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  // 发送axios请求，
  // return 把 promise 得到的结果返回出去
  return axios.get(url, {
    // 把参数通过param去传过去
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 封装了歌手列表页面的数据的方法。