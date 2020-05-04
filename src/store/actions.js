import * as types from './mutation-types'

// 告诉这个对象，列表是哪个，索引是哪个
export const selectPlay = function ({commit, state}, {list, index}) {
  // 提交mutations
  // 顺序播放
  commit(types.SET_SEQUENCE_LIST ,list)
  // 播放列表
  commit(types.SET_PLAYLIST,list)
  // 播放是那一首歌
  commit(types.SET_CURRENT_INDEX, index)
  // 屏幕打开
  commit(types.SET_FULL_SCREEN, true)
  // 播放和暂停
  commit(types.SET_PLAYING_STATE, true)
}