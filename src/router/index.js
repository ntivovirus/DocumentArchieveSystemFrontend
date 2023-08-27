import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CorrespondenceView from '../views/CorrespondenceView.vue'
import DocumentView from '../views/HomeView.vue'
import Navbar from '@/components/Navbar.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Navbar,
    children: [
      {
        path: '',
        name: 'home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue')
       
      },
      {
        path: '/file',
        name: 'file',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/FileView.vue')
       
      },
      {
        path: '/correspondence',
        name: 'correspondence',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/CorrespondenceView.vue')
        // component: CorrespondenceView
    
      },
      {
        path: '/document',
        name: 'document',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/DocumentView.vue')
      },
      {
        path: '/user',
        name: 'user',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView.vue')
      },
      {
        path: '/usersetting',
        name: 'usersetting', 
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSettingView.vue')
      }

    ]

  }, 
  
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component : login
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && sessionStorage.getItem("api_token")=== null ) next({ name: 'login' })
  // if the user is not authenticated, `next` is called twice
  next()
})

export default router
