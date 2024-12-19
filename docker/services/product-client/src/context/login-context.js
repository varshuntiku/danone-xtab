import React from 'react';

const LoginContext = React.createContext({
    selected_industry: '',
    selected_app_id: null
});

export default LoginContext;
