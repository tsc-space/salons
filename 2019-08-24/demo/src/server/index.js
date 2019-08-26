import express from "express"
import cors from "cors"
import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter, matchPath } from "react-router-dom"
import serialize from "serialize-javascript"
import App from '../shared/App'
import routes from '../shared/routes'
const fs = require('fs');
const path = require('path');

// 读取html模板
const template = fs.readFileSync(path.resolve(process.cwd(), 'public/index.html'), 'utf-8');

const app = express()

app.use(cors())
app.use(express.static("public"))

app.get("*", (req, res, next) => {
  // 找到当前请求的url对应的route配置项
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

  // 如果路由配置项有fetchInitialData, 那就请求数据
  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve()

  promise.then((data) => {
    // 在server中, 子路由可通过访问this.props.staticContext拿到数据
    const context = { data };

    // 在server中, 需要使用StaticRouter
    const markup = renderToString(
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    );

    // window.__INITIAL_DATA__, 便是客户端的初始数据
    // 读取html模板 + 占位符替换的方式更优雅
    res.send(
      template
        .replace('<!-- SCRIPT_PLACEHOLDER -->', `<script>window.__INITIAL_DATA__ = ${serialize(data)}</script>`)
        .replace('<!-- HTML_PLACEHOLDER -->', markup)
      );

    // res.send(`
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>SSR with RR</title>
    //       <script src="/bundle.js" defer></script>
    //       <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
    //     </head>

    //     <body>
    //       <div id="root">${markup}</div>
    //     </body>
    //   </html>
    // `);
  }).catch(next)
})

app.listen(3000, () => {
  console.log(`Server is listening on port: 3000`)
})

/*
  1) Just get shared App rendering to string on server then taking over on client.
  2) Pass data to <App /> on server. Show diff. Add data to window then pick it up on the client too.
  3) Instead of static data move to dynamic data (github gists)
  4) add in routing.
*/