// 添加样式的方法 （DOM对象,className）
export function addClass(el, className) {
  // DOM对象有className的时候就什么都不做
  if(hasClass(el,className)) {
    return
  }
  // spilt方法拆分数组
  let newClass = el.className.split('')
  newClass.push(className)
  // join方法转为字符串
  el.className = newClass.join('')
}

// 判断DOM对象是否有这个className
export function hasClass(el, className) {
  // ^|\\s+ 表示什么都没有（起始位制置）或者 空白符
  // \s+|$ 表示 空白符或者什么都没有（结束位置）
  // 含有className 首尾有空白符或者什么都没有的复的字符串
  let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
  return reg.test(el.className)
}

// 封装一个方法，得到data-index的值
// 1.参数：DOM对象
// 2.名称
// 3.值：通常表示get和set
export function getData(el, name, val) {
  const prefix = 'data-'
  // 如果有这个值的话
  if (val) {
    // setAttribute：设置对象的属性，如果不存在此属性，则会创建此属性。
    return el.setAttribute(prefix + name, val)
  }
    return el.getAttribute(prefix + name)
}


// 封装JS，vender浏览器供应商
let elementStyle = document.createElement('div').style

// vendor立即执行函数
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  // 对key进行遍历
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

// 暴露一个方法，
// 这个方法会自动根据浏览器所支持的情况自动添加前缀
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  // 如果css样式只有standard这个标准，就返回这个标准
  if (vendor === 'standard') {
    return style
  }

  // 否则就返回根据浏览器前缀拼接出来的一个字符串
  // style.charAt(0).toUpperCase() 第一个字符大写
  // style.substr(1) + 剩余部分
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}