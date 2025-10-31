import Vue from 'vue'
import VueRouter from 'vue-router'
import UserView from '../views/UserView.vue'
import QuestionView from '../views/QuestionView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    name: 'user',
    component: UserView
  },
  {
    path: '/question',
    name: 'question',
    component: QuestionView
  },
  // about route removed (AboutView deleted)
]

const router = new VueRouter({
  routes
})

export default router
