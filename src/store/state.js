// 1.想清楚原始数据是什么
import {playMode} from 'common/js/config'

const state = {
  // singer本身是一个空的，从singer.vue中提交数据来的
  singer: {},
  // 播放和暂停
  playing:false,
  // 全屏
  fullScreen:false,
  // 当顺序播放时候，playlist和sequenceList是一致的
  // 播放列表
  playlist:[],
  // 顺序列表
  sequenceList:[],
  // 播放模式
  mode:playMode.sequence,
  // 当前播放的是哪一首歌，索引
  // 前进后退的时候就会修改这个currentIndex
  currentIndex: -1
}

export default state