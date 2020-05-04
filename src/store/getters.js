// 2.对数据映射：getters包装 从getters中取数据到组件中

// import state from "./state"

// function,return了一个state.singer
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

// 当前歌曲
export const currentSong = (state) => {
  // 当前播放列表下的第几首歌
  return state.playlist[state.currentIndex] || {}
}