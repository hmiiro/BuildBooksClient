import React, { useEffect, useContext } from 'react';

import { AuthContext } from '../../context/auth';

function Logout(props) {
    /**
     * Redirect to login
     */
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        console.log(props);
        logout();
        props.history.push('/account/login');
    }, []);

    return <React.Fragment>Logged out</React.Fragment>;
}

export default Logout;
