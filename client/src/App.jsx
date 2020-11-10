import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { Nightmode } from './styles/Themes';
import { GlobalStyle } from "./styles/GlobalStyle";

import Authentication from './utils/Authentication';
import Canvas from './pages/Canvas';
import Content from './pages/Content';
import Derp from './pages/Derp';
import Home from './pages/Home';
import Authoritaw from './pages/Authoritaw';
import Spinner from './components/elements/Spinner';
import Images from './pages/Images';

import API from './api';
import { setAuthToken, resetAuthToken } from './utils/token';

export let UserContext;

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    UserContext = React.createContext(user);

    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem('token');
            try {
                if (token) {
                    setAuthToken(token); // set token to login
                    const response = await API.user.me();
                    setUser(response.data.user);
                    setAuthToken(response.data.token); // set latest token
                }
            } catch (e) {
                if (token) resetAuthToken();
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        }
        fetchUser();
    }, []);

    async function login(data) {
        const response = await API.user.login(data);
        setUser(response.data.user);
        setAuthToken(response.data.token);
    }

    async function signup(data) {
        const response = await API.user.register(data);
        setUser(response.data.user);
        setAuthToken(response.data.token);
    }

    function logout() {
        resetAuthToken();
        setUser(null);
    }

    if (loading) {
        return (
            <div>
                <Spinner />
            </div>
        )
    }
    return (
        <ThemeProvider theme={Nightmode}>
            <UserContext.Provider value={user}>
                <GlobalStyle />

                <Router>
                    <Switch>
                        <Route exact path="/">
                            {routeProps => (
                                <Home {...routeProps} logout={logout} />
                            )}
                        </Route>

                        <Route
                            exact
                            path="/login"
                            component={Authentication(Authoritaw, { authenticated: user, required: false, login, signup, logout })}
                        />

                        <Route
                            exact
                            path="/images"
                            component={Authentication(Images, { authenticated: user, required: true, logout })}
                        />

                        <Route
                            exact
                            path="/canvas"
                            component={Authentication(Content, { authenticated: user, required: true, logout })}
                        />

                        <Route
                            path="/canvas/:id"
                            component={Authentication(Canvas, { authenticated: user, required: true, logout })}
                        />

                        <Route
                            path="/derp/:name"
                            component={Authentication(Derp, { authenticated: user, required: true, logout })}
                        />
                    </Switch>
                </Router>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default App;
