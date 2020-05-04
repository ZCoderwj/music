/** 
 * 调用的API
 * JSONP原理 jsonp(URL,opts,fn)
 * URL:要获取的字符串
 * opts：对象，是可选的
 *   选项：1.param(字符串类型):用于指定回调（默认为回调）
 *   选项: 2.timeout（Number）：在发出超时错误后持续时间
 *   选项：3.prefix(String)：用于处理jsonp响应的全局回调函数prefix
 *   选项: 4.name(String)：用于处理jsonp响应的全局回调函数的名称
 * fn（回调函数）：
 * 使用err数据参数调用该回调。
   如果超时，则错误将是错误对象，其消息为超时。
   返回一个函数，该函数在被调用时将取消正在进行的jsonp请求（不会调用fn）。

   它发送的并不是ajax请求，它利用的是动态创建一个script标签，script标签是没有同源限制的，把script的src指向请求的服务端地址，地址后会有一个参数，例如callback = a， 服务端会解析到URL，带有callback=a这样的一个参数，就会在返回的数据里调用a去包裹一段数据，相当于在前端执行a方法，所以我们要认为的在window上定义一个a方法。
 * */ 

// 4.收到JSONP请求
// 引入JSONP
import originJSONP from 'jsonp'
// import { urlencoded } from 'express'

// 4.对外暴露一个方法
// 要把url拼好在去调用这个库
export default function jsonp(url,data,option) {
  // 根据url是否带有参数决定参数前缀符
  // 希望调用的时候URL就是一个纯净的地址，后续其他通过data去进行拼接
  // indexOf('?')<0 没有? 就拼接一个 ? 有的话就 拼接一个&
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  // 返回一个可以链式调用的promise对象
  return new Promise((resolve, reject) => {
    originJSONP(url, option,(err, data) => {
      if(!err){
        // 成功的时候，把后端返回的数据发送出去
        resolve(data)
      }else {
        reject(err)
      }
    })
  })
}

// param（callback）和后端约定的字段
function param(data) {
  let url = ''
  // 遍历data
  for(var k in data) {
    // 如果这个值是undefined，就传空，不为空就传data[k]
    let value = data[k] !== undefined? data[k] : ''
    // url = url + '&' + k + '= ' + encodeURIComponent(value)
    url += `&${k}=${encodeURIComponent(value)}`
  }
  
  // 必需。一个非负的整数，规定要提取的子串的第一个字符在 stringObject 中的位置。，将第一个拼接的字符去掉
  return url ? url.substring(1) : ''
}