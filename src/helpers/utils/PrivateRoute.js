import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../../context/auth';

// handle auth and authorization
function PrivateRoute({ component: Component, roles, ...rest }) {
    const { user } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={(props) =>
                user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />
                )
            }
        />
    );
}

export default PrivateRoute;
