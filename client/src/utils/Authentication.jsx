import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";

export default (WrappedComponent, passedProps = {}) => {
    function Authentication(props) {
        const [redirect, setRedirect] = useState(false);
        const [destination, setDestination] = useState('');

        useEffect(() => {
            function checkAuthenticated() {
                const { required, authenticated } = passedProps;
    
                if (required && !authenticated) {
                    setRedirect(true);
                    setDestination('login');
                }
    
                if (!required && authenticated) {
                    setRedirect(true);
                    setDestination('');
                }
            }

            checkAuthenticated();
        });

        if (redirect)
            return <Redirect to={`/${destination}`} />
        
        return <WrappedComponent {...props} {...passedProps} />
    }

    return Authentication;
}