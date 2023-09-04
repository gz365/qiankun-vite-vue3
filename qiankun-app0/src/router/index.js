import { createRouter, createWebHistory } from 'vue-router'
import PageA from '@/views/PageA.vue'
export default function (baseUrl) {
  return createRouter({
    history: createWebHistory(baseUrl || import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        redirect: '/A'
      },
      {
        path: '/A',
        name: 'PageA',
        component: PageA
      },
      {
        path: '/B',
        name: 'PageB',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/PageB.vue')
      }
    ]
  })
}
