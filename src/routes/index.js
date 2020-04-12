import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

import AuthRoute from '../helpers/utils/AuthRoute';
import PrivateRoute from '../helpers/utils/PrivateRoute';

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));
// dashboard
const EcommerceDashboard = React.lazy(() => import('../pages/dashboards/Ecommerce'));
const CRMDashboard = React.lazy(() => import('../pages/dashboards/CRM'));
const AnalyticsDashboard = React.lazy(() => import('../pages/dashboards/Analytics'));
const ProjectDashboard = React.lazy(() => import('../pages/dashboards/Project'));

// BILLS
const Bills = React.lazy(() => import('../pages/bills/Bills'));

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboard/ecommerce" />,
    route: PrivateRoute,
};

// dashboards
const dashboardRoutes = {
    path: '/dashboard',
    name: 'Dashboards',
    icon: 'uil-home-alt',
    header: 'Navigation',
    children: [
        {
            path: '/dashboard/analytics',
            name: 'Analytics',
            component: AnalyticsDashboard,
            route: PrivateRoute,
        },
        {
            path: '/dashboard/crm',
            name: 'CRM',
            component: CRMDashboard,
            route: PrivateRoute,
        },
        {
            path: '/dashboard/ecommerce',
            name: 'Ecommerce',
            badge: {
                variant: 'success',
                text: '3',
            },
            component: EcommerceDashboard,
            route: PrivateRoute,
        },
        {
            path: '/dashboard/project',
            name: 'Project',
            component: ProjectDashboard,
            route: PrivateRoute,
        },
    ],
};

const billRoutes = {
    path: '/bills',
    name: 'Bills',
    route: PrivateRoute,
    roles: ['Admin'],
    icon: 'uil-clipboard-alt',
    component: Bills,
};

// auth
const authRoutes = {
    path: '/account',
    name: 'Auth',
    children: [
        {
            path: '/account/login',
            name: 'Login',
            component: Login,
            route: AuthRoute,
        },
        {
            path: '/account/logout',
            name: 'Logout',
            component: Logout,
            route: Route,
        },
        {
            path: '/account/register',
            name: 'Register',
            component: Register,
            route: AuthRoute,
        },
        {
            path: '/account/confirm',
            name: 'Confirm',
            component: Confirm,
            route: AuthRoute,
        },
        {
            path: '/account/forget-password',
            name: 'Forget Password',
            component: ForgetPassword,
            route: AuthRoute,
        },
    ],
};

// flatten the list of all nested routes
const flattenRoutes = (routes) => {
    let flatRoutes = [];

    routes = routes || [];
    routes.forEach((item) => {
        flatRoutes.push(item);

        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes
const allRoutes = [rootRoute, dashboardRoutes, billRoutes, authRoutes];

const authProtectedRoutes = [dashboardRoutes, billRoutes];

const allFlattenRoutes = flattenRoutes(allRoutes);

export { allRoutes, authProtectedRoutes, allFlattenRoutes };
