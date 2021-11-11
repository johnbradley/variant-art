import Vue from 'vue'
import VueRouter from 'vue-router'
import ConceptView from '../views/ConceptView.vue'
import CreateView from '../views/CreateView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Concept',
    component: ConceptView
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateView
  }
]

const router = new VueRouter({
  routes
})

export default router
