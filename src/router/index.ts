import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import CreateProfileView from '@/views/profile/CreateProfileView.vue'
import EditProfileView from '@/views/profile/EditProfileView.vue'
import DetailProfileView from '@/views/profile/DetailProfileView.vue'
import PostView from '@/views/post/PostView.vue'
import CreatePostView from '@/views/post/CreatePostView.vue'
import EditPostView from '@/views/post/EditPostView.vue'
import DetailPostView from '@/views/post/DetailPostView.vue'
import { isAuthenticated, isAdmin, canAccessProfile } from '@/lib/rbac'
import { toast } from 'vue-sonner'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profiles',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/profiles/add',
      name: 'create-profile',
      component: CreateProfileView,
    },
    {
      path: '/profiles/:id/edit',
      name: 'edit-profile',
      component: EditProfileView,
    },
    {
      path: '/profiles/:id',
      name: 'detail-profile',
      component: DetailProfileView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
    },
    {
      path: '/posts/add',
      name: 'create-post',
      component: CreatePostView,
    },
    {
      path: '/posts/:id/edit',
      name: 'edit-post',
      component: EditPostView,
    },
    {
      path: '/posts/:id',
      name: 'detail-post',
      component: DetailPostView,
    },
  ],
})

// Navigation guard for RBAC
router.beforeEach((to, _, next) => {
  const publicPaths = new Set(['/', '/login', '/register']);
  const protectedPaths = ['/profiles', '/profiles/add', '/posts'];
  const auth = isAuthenticated();

  // 🔒 Redirect unauthenticated users trying to access protected routes
  if (!auth && protectedPaths.some(p => to.path.startsWith(p)) && !publicPaths.has(to.path)) {
    toast.error('Token expired, please log in again');
    return next('/login');
  }

  // 🏠 Allow public routes
  if (publicPaths.has(to.path)) return next();

  // 👮 RBAC rules
  if (to.path === '/profiles' && !isAdmin()) {
    toast.error('Forbidden');
    return next('/');
  }

  if (to.path === '/profiles/add' && !isAdmin()) {
    toast.error('Forbidden');
    return next('/');
  }

  if (to.path.startsWith('/profiles/') && to.params.id && !canAccessProfile(String(to.params.id))) {
    toast.error('Forbidden');
    return next('/');
  }

  // ✅ Default allow
  next();
});


export default router
