// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 这里是主文件
import Vue from 'vue'
// 引入的路径 没有 ./ /  直接些名字是找的node_modules目录下的文件
import Router from 'vue-router'
// <script src='vue-router'></script>
// 传值的方式
// 1.通过网址传递 在路由里获取
// 2.同上  直接:to="{ path:'/b/bb',query:{ id:123 } }"  传递的方式是明文的 在网址后面会加上 ?xxx=xxx
// 3.params传值方式 必须是通过name去寻找对应的路由 才可以获取到数据
// 首页 -> a -> b
const App = {
  template: `<div id="app">
    默认显示的内容
    <h2>前进后退导航</h2>
    <button @click="$router.go(-1)">返回</button>
    <button @click="$router.go(1)">前进</button>
    
    <ul>
      <li><router-link to="/">首页</router-link></li>
      
      <h2>子路由</h2>
      <li>
        <router-link to="/a">a</router-link>
        <ul>
          <li><router-link to="/a/aa">/a/aa</router-link></li>
          <li><router-link to="/a/aaa">/a/aaa</router-link></li>
        </ul>
      </li>
      
      <h2>查询路由</h2>
      <li><router-link :to="{ name:'b',query:{ id:123 } }">/b/bb</router-link></li>
      
      <li><router-link :to="{ path:'/b/bb',params:{ id:123 } }">/b/bb</router-link></li>
      <li><router-link :to="{ name:'c',params:{ id:'cccccccc' } }">/c</router-link></li>
      <li><router-link to="/d">/d</router-link></li>
      <li><router-link to="/e">/e</router-link></li>
      <li><router-link :to="{path: '/f',query:{id:123}}">/f</router-link></li>
      
      <h2>beforeEnter与beforeRouteEnter</h2>
      <li><router-link to="/g">/g</router-link></li>
    </ul>
    <router-view></router-view>
  </div>`
}
const index = {
  template: `<div>这里是index</div>`
}
const a = {
  template: `<div>
    <p>这里是a</p>
    <router-view></router-view>
  </div>`
}
const aa = {
  template: `<div>这里是aa{{ $route.params }}</div>`
}
const b = Vue.component('vb', {
  template: `<div>这里是b</div>`,
  mounted () {
    console.log(this.$route)
  }
})
const c = {
  template: `<div>{{ $route.params }}</div>`
}
const g = Vue.component('vg', {
  template: `<div>这里是g</div>`,
  // 模板内容显示到页面之前
  beforeRouteEnter (to, from, next) {
    console.log(arguments)
    next(); // 使模板显示
  }
})
// 跟路由显示的地方是第一个 router-view 标签里
const router = new Router({
  routes: [
    // 在 routes 里面的称之为跟路由
    // 跟路由是可以写 /
    {path: '/', component: index},
    {
      path: '/a',
      component: a,
      children: [
        // 子路有不可以写 /
        // 父级路由已经定义了 /a/子路有的path
        // 子路由显示的地方 父级路由模板里的第一个 router-view 标签里
        // :随便起的名字  绑定了一个值是可以接收数据
        // http://localhost:8080/#  /a/     aa
        // /a/父级路由对应上了
        {path: 'aaa', component: aa},
        {path: ':id', component: aa}
      ]
    },
    //      /b/ bb
    {path: '/b/:id', name: 'b', component: b},
    {path: '/c', name: 'c', component: c},
    // 1.直接写想要跳转到的网址
    {path: '/d', redirect: 'http://baidu.com'},
    // 2.根据name跳转
    {path: '/e', redirect: {name: 'c'}},
    // 3.定义函数
    {path: '/f',
      redirect: (hash, params, query) => {
        // return '/c'
        if (hash.query.id === 123456) {
          return {name: 'c'}
        } else {
          return '/a'
        }
      }},
    {
      path: '/g',
      component: g,
      // 触发的事件 访问这个网址之后 加载模板之前
      beforeEnter (to, from, next) {
        // 到哪里去 从哪里来  是否继续往下加载模板
        // console.log(arguments)
        setTimeout(() => {
          next()
        }, 2000)
      }
    }
  ]
})
// 使用路由插件
Vue.use(Router)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 传递一个参数: 让页面默认显示的模板 return
  render: h => h(App)
})
// template: '<App/>',components: { App }
