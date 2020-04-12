// @flow
import React from 'react';
import Routes from './routes/Routes';

// Themes
import './assets/scss/Saas.scss';

// For Dark import Saas-Dark.scss
// import './assets/scss/Saas-Dark.scss';

// For Modern import Modern.scss
// import './assets/scss/Modern.scss';
// For modern dakr import Modern-Dark.scss
// import './assets/scss/Modern-Dark.scss';

// For Creative demo import Modern.scss
// import './assets/scss/Creative.scss';
// For Creative dark demo import Modern.scss
// import './assets/scss/Creative-Dark.scss';

// configure auth
import { AuthProvider } from './context/auth';

/**
 * Main app component
 */
function App() {
    return (
        <AuthProvider>
            <Routes></Routes>;
        </AuthProvider>
    );
}

export default App;
