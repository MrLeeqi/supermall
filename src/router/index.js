import {createRouter, createWebHistory} from 'vue-router'

const Home = () => import ('views/home/Home')
const Detail = () => import ('views/detail/Detail')
const Cart = () => import ('views/cart/Cart')
const Category = () => import ('views/category/Category')
const Profile = () => import ('views/profile/Profile')

const routerHistory = createWebHistory()

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/detail/:iid',
    component: Detail,
    meta: {
      title: '详情页面'
    }
  },
  {
    path: '/cart',
    component: Cart,
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/category',
    component: Category,
    meta: {
      title: '分类'
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      title: '个人中心'
    }
  }
]

const router = createRouter({
  history: routerHistory,
  routes,
})

export default router
