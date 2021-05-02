import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'

import Layout from "../src/layouts/Layout.vue";

Vue.use(Router);
Vue.use(VueCookies);

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
            },
            children: [
                {
                    path: "/login/:email/:token",
                    component: () => import('@/components/LoginBox'),
                    props: { default: true }
                }
            ]
        },
        {
            path: '/dashboard',
            component: Layout,
            // redirect :'dashboard/basic-dashboard',
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
                    name: "Dashboard",
                    path: '/dashboard/home',
                    component: () => import('@/views/dashboard/BasicDashboard'),
                },

                {
                    name: 'Placements',
                    path: '/dashboard/Placements',
                    component: () => import('@/views/pages/Alerts'),
                },

                {
                    name: 'Profile',
                    path: '/dashboard/profile',
                    component: () => import('@/views/pages/Profile'),
                },

                {
                    name: 'Icons',
                    path: '/dashboard/icons',
                    component: () => import('@/views/pages/Icons'),
                },

                {
                    name: 'TableSimple',
                    path: '/dashboard/tables-simple',
                    component: () => import('@/views/pages/TableSimple'),
                },

                {
                    name: 'InterviewExperince',
                    path: '/dashboard/interview-experience',
                    component: () => import('@/views/pages/InterviewExperience'),
                },

                {
                    name: 'Calendar',
                    path: '/dashboard/calendar',
                    component: () => import('@/views/pages/Calendar'),
                },

                {
                    name: 'Company',
                    path: '/dashboard/company',
                    component: () => import('@/views/pages/Company'),
                },
                {
                    name: 'CompanyDetails',
                    path: '/dashboard/companies/:id',
                    component: () => import('@/components/studentDashboard/placements/listPlacements'),
                },

                {
                    name: 'Placement',
                    path: '/dashboard/placements/:id',
                    component: () => import('@/components/studentDashboard/placements/displayPlacement'),
                },

                // {
                //     name: 'Snap',
                //     path: '/dashboard/snaps',
                //     component: () => import('@/components/studentDashboard/placements/displayDatasnapshots'),
                // },
            ]
        },
    ],
})