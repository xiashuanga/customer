import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
// import Emo from '@/pages/Emo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, 
    // {
    //   path: '/emo',
    //   name: 'Emo',
    //   component: Emo
    // },
  ]
})
