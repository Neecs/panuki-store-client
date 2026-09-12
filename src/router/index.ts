import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../modules/admin/composables/useAuth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'store',
      component: () =>
        import('../modules/product/pages/ProductListingPage/ProductListingPage.vue'),
      meta: { title: 'Panuki Store' },
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../modules/admin/pages/AdminLoginPage/AdminLoginPage.vue'),
      meta: { guestOnly: true, title: 'Ingresar — Panuki Admin' },
    },
    {
      path: '/admin',
      component: () => import('../modules/admin/layouts/AdminLayout/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-products',
          component: () =>
            import('../modules/admin/pages/AdminProductsPage/AdminProductsPage.vue'),
          meta: { title: 'Productos — Panuki Admin' },
        },
        {
          path: 'productos/nuevo',
          name: 'admin-product-new',
          component: () =>
            import('../modules/admin/pages/AdminProductFormPage/AdminProductFormPage.vue'),
          meta: { title: 'Nuevo producto — Panuki Admin' },
        },
        {
          path: 'productos/:id',
          name: 'admin-product-edit',
          component: () =>
            import('../modules/admin/pages/AdminProductFormPage/AdminProductFormPage.vue'),
          props: true,
          meta: { title: 'Editar producto — Panuki Admin' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'admin-products' }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Panuki Store'

  const isAdminRoute = to.path.startsWith('/admin')
  let robotsTag = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (isAdminRoute) {
    if (!robotsTag) {
      robotsTag = document.createElement('meta')
      robotsTag.name = 'robots'
      document.head.appendChild(robotsTag)
    }
    robotsTag.content = 'noindex, nofollow'
  } else if (robotsTag) {
    robotsTag.remove()
  }
})

export default router
