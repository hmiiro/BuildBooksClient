import React, { useContext } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

import { allFlattenRoutes as routes } from './index';
import * as layoutConstants from '../constants/layout';
import { AuthContext } from '../context/auth';
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
const ViewBill = React.lazy(() => import('../pages/bills/ViewBill'));

// Lazy loading and code splitting -
// Derieved idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => <div></div>;

// All layouts/containers
const AuthLayout = Loadable({
    loader: () => import('../layouts/Auth'),
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    },
    loading,
});

const VerticalLayout = Loadable({
    loader: () => import('../layouts/Vertical'),
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    },
    loading,
});

const HorizontalLayout = Loadable({
    loader: () => import('../layouts/Horizontal'),
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    },
    loading,
});

const DetachedLayout = Loadable({
    loader: () => import('../layouts/Detached'),
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    },
    loading,
});

function Routes(props) {
    const { user } = useContext(AuthContext);

    // returns the layout
    function getLayout() {
        return user ? VerticalLayout : AuthLayout;
    }

    const Layout = getLayout();
    // rendering the router with layout
    return (
        <BrowserRouter>
            <Layout {...props}>
                <Switch>
                    <AuthRoute path="/account/login" exact component={Login} />
                    <AuthRoute path="/account/logout" exact component={Logout} />
                    <AuthRoute path="/account/register" exact component={Register} />
                    <AuthRoute path="/account/confirm" exact component={Confirm} />
                    <AuthRoute path="/account/forget-password" exact component={ForgetPassword} />
                    <PrivateRoute path="/dashboard/ecommerce" exact component={EcommerceDashboard} />
                    <PrivateRoute path="/bills/" exact component={Bills} />
                    <PrivateRoute path="/bills/:id" exact component={ViewBill} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default Routes;
