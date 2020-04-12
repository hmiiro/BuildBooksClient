// @flow
import React, { Suspense, useEffect } from 'react';

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
// const Footer = React.lazy(() => import("./Footer"));
// loading
const loading = () => <div className="text-center"></div>;

function DefaultLayout(props) {
    /**
     * On component update - update layout
     */

    useEffect(() => {
        document.body
            ? document.body.classList.add('authentication-bg')
            : document.body.classList.remove('authentication-bg');
    });
    /**
     * On component unmount - reset layout
     */

    const children = props.children || null;

    return <Suspense fallback={loading()}>{children}</Suspense>;
}

export default DefaultLayout;
