import React, { useEffect, useContext } from 'react';

import { AuthContext } from '../../context/auth';

function Logout(props) {
    /**
     * Redirect to login
     */
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        props.history.push('/account/login');
        logout();
    }, [logout]);

    return <React.Fragment></React.Fragment>;
}

export default Logout;
