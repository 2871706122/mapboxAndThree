import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Page2 from '@/components/Page2'
import Page3 from '@/components/Page3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/page2',
      name: 'page2',
      component: Page2
    },
    {
      path: '/page3',
      name: 'page3',
      component: Page3
    },
  ]
})
