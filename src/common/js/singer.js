// singer类
export default class Singer { //类似于构造函数
  // JavaScript constructor 属性返回对创建此对象的数组函数的引用
  constructor({id, name}) { //构造函数里面有constructor属性
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}