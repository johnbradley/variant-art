import Vue from 'vue'
import VueRouter from 'vue-router'
import Concept from '../views/Concept.vue'
import Visualize from '../views/Visualize.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Concept',
    component: Concept
  },
  {
    path: '/visualize',
    name: 'Visualize',
    component: Visualize
  }
]

const router = new VueRouter({
  routes
})

export default router
