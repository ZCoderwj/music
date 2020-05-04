export default class Song {
  constructor({id,mid,singer,name,album,duration,image,url}) {
    // 初始化，绑定到当前实例对象
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

// 抽象出来一个工厂方法，实例化一个Song
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    // duration:播放时间
    duration: musicData.interval,
    // url拼接上中间有一块是可变的
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

// 写一个方法，用来直接singer处理数据,将对象转化为字符串
export function filterSinger(singer) {
  let ret = []
  // 如果singer传入空，就直接返回空
  if (!singer) {
    return ''
  }
  // 遍历singer,拿到每个元素
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
