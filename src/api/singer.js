import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  // assign第三个参数会覆盖第二个参数
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    // 查所有歌手
    key: 'all_all_all',
    // 查100条数据
    pagesize: 100,
    // 第一页
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk:1664029744
  })
  // 发送jsonp请求
  return jsonp(url, data, options)
}

// 通过传入不同的id,得到不同的详情
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    // 取得我们要传入的mid
    singermid: singerId,
    g_tk:1664029744
  })

  // 发送jsonp请求
  return jsonp(url, data, options)
}
