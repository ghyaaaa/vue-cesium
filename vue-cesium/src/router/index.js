import Vue from 'vue'
import Router from 'vue-router'
//import cesiumContainer from '@/components/cesiumContainer'
//import cesiumContainer from '@/components/material'
//import cesiumContainer from '@/components/czml'
//import cesiumContainer from '@/components/hotmap'
import cesiumContainer from '@/components/air'
// import  haha from '@/components/b'
// import  aaaa from '@/components/a'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: cesiumContainer
    }
    // {
    //   path: '/haha',
    //   name: 'haha',
    //   component: haha
    // },{
    //   path: '/',
    //   name: 'aaaa',
    //   component: aaaa
    // }
  ]
})
