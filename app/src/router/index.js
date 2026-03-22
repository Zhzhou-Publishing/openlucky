import { createRouter, createWebHashHistory } from 'vue-router'
import About from '../pages/About.vue'
import PhotoDirectory from '../pages/PhotoDirectory.vue'
import PhotoGallery from '../pages/PhotoGallery.vue'
import PhotoEdit from '../pages/PhotoEdit.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PhotoDirectory
  },
  {
    path: '/photo-directory',
    name: 'PhotoDirectory',
    component: PhotoDirectory
  },
  {
    path: '/photo-gallery',
    name: 'PhotoGallery',
    component: PhotoGallery
  },
  {
    path: '/photo-edit',
    name: 'PhotoEdit',
    component: PhotoEdit
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
