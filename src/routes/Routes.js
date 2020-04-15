import React, { useContext } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import { AuthContext } from '../context/auth';
import AuthRoute from '../helpers/utils/AuthRoute';
import PrivateRoute from '../helpers/utils/PrivateRoute';
import SimpleLayout from '../layouts/SimpleLayout';
import AuthSimpleLayout from '../layouts/AuthSimpleLayout';

// auth

import Login from '../pages/auth/Login';
import Logout from '../pages/auth/Logout';
import Register from '../pages/auth/Register';
import ForgetPassword from '../pages/auth/ForgetPassword';
import Confirm from '../pages/auth/Confirm';
// dashboard
import EcommerceDashboard from '../pages/dashboards/Ecommerce';
import CRMDashboard from '../pages/dashboards/CRM';
import AnalyticsDashboard from '../pages/dashboards/Analytics';
import ProjectDashboard from '../pages/dashboards/Project';

// BILLS
import Bills from '../pages/bills/Bills';
import ViewBill from '../pages/bills/ViewBill';
import CreateBill from '../pages/bills/CreateBill';

function Routes(props) {
    const { user } = useContext(AuthContext);

    // returns the layout
    function getLayout() {
        return user ? SimpleLayout : AuthSimpleLayout;
    }

    const Layout = getLayout();
    // rendering the router with layout
    return (
        <BrowserRouter>
            <Layout />
            <Container>
                <Switch>
                    <AuthRoute path="/account/login" exact component={Login} />
                    <PrivateRoute path="/account/logout" exact component={Logout} />
                    <AuthRoute path="/account/register" exact component={Register} />
                    <AuthRoute path="/account/confirm" exact component={Confirm} />
                    <AuthRoute path="/account/forget-password" exact component={ForgetPassword} />
                    <PrivateRoute path="/" exact component={EcommerceDashboard} />
                    <PrivateRoute path="/dashboard/ecommerce" exact component={EcommerceDashboard} />
                    <PrivateRoute path="/dashboard/crm" exact component={CRMDashboard} />
                    <PrivateRoute path="/dashboard/analytics" exact component={AnalyticsDashboard} />
                    <PrivateRoute path="/dashboard/project" exact component={ProjectDashboard} />
                    <PrivateRoute path="/bills/" exact component={Bills} />
                    <PrivateRoute path="/bills/createbill" exact component={CreateBill} />
                    <PrivateRoute path="/bills/:id" exact component={ViewBill} />
                </Switch>
            </Container>
        </BrowserRouter>
    );
}

export default Routes;
