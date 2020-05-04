require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var axios = require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

// express 是基于 Node.js 开发的后端框架
var app = express()

// 其实我们可以将router视为一个路由分支，因此router是有中间件和HTTP方法路由（如get，put，post，等），router就像一个应用程序。
var apiRoutes = express.Router()

// req，和 res 这两个参数分别代表请求对象和响应对象
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // 发送http请求，修改referer
  // axios 发送请求返回 Promise 是 axios 库的一个设计。
  axios.get(url, {
    // 欺骗QQ音乐
    headers: {
      // referer：客户端指定自己想访问的WEB服务器的域名/IP 地址和端口号。
      referer: 'https://c.y.qq.com/',
      // host:告知服务器请求的原始资源的URI，其用于所有类型的请求，并且包括：协议+域名+查询参数（注意，不包含锚点信息）。
      host: 'c.y.qq.com'
    },
    // req.query 就是请求的 query 参数
    // 一个对象，包含以键值对存放的查询字符串参数
    // params是把recommend.js里定义的data参数，原封不动的透传给qq的服务端
    params: req.query
    // response 是 axios 返回的响应对象， response.data 才是服务端返回的数据。
  }).then((response) => {
    // node.js服务端将api返回值json格式化，这样前端请求api得到的json格式数据
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

// app.use是express“调用中间件的方法”。所谓“中间件（middleware），就是处理HTTP请求的函数，用来完成各种特定的任务
app.use('/api', apiRoutes)

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
