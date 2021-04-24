import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'

Vue.use(Router)
Vue.use(VueCookies)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: "Home",
            component: () => import('@/views/Home'),
        },
        {
            path: '/login',
            name: "Login",
            component: () => import('@/views/Login'),
            beforeEnter: (to, from, next) => {
                let access_token = window.$cookies.get("jwt");
                if (access_token == null) {
                  next();
                } else {
                  // user has access token, user can open the page
                  next({ name: "Dashboard" });
                }
              }
        },
        {
            path: '/dashboard',
            component: () => import('@/layouts/Layout'),
            beforeEnter: (to, from, next) => {
                let access_token = window.$cookies.get("jwt");
                if (access_token != null) {
                  next();
                } else {
                  next({ name: "Login" });
                }
              },
            children: [
                // Components
                {
                    path: '/',
                    name: "Dashboard",
                    component: () => import('@/views/dashboard/BasicDashboard'),
                },

                {
                    name: 'Alerts',
                    path: 'pages/alerts',
                    component: () => import('@/views/pages/Alerts'),
                },

                {
                    name: 'Profile',
                    path: 'pages/profile',
                    component: () => import('@/views/pages/Profile'),
                },

                {
                    name: 'Icons',
                    path: 'pages/icons',
                    component: () => import('@/views/pages/Icons'),
                },

                {
                    name: 'TableSimple',
                    path: 'pages/tables-simple',
                    component: () => import('@/views/pages/TableSimple'),
                },
            ]
        },

    ],
})