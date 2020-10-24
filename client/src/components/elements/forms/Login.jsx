import React, { useState } from 'react';
import styled from 'styled-components';

const Login = props => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = e => {
        const { name, value } = e.target;
        if (name === 'username') return setUsername(value);
        setPassword(value);
    }

    const enterSandman = async e => {
        e.preventDefault();
        console.log('props:::', props);
        try {
            props.login({ username, password });
        } catch (e) {
            setError(e.response.data.error);
        }
    }

    return (
        <Form style={props.style}>
            <h3>Login</h3>
            <input
                type="text"
                name="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Enter your username"
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Enter your password"
            />
            <button
                disabled={!username || !password}
                onClick={enterSandman}
            >
                Abandon all hope...
            </button>
            <Error>{error}</Error>
        </Form>
    )

}

export default Login;

const Form = styled.form`
    border-right: 2px solid ${props => props.theme.nPurple};
    height: 340px;
    margin: auto 0;
    padding: 20px 60px;
    position: relative;
    text-align: left;
    transition: transform .3s, opacity .35s;
    width: 360px;

    h3 {
        color: ${props => props.theme.nBlue};
        font-size: 36px;
        margin-bottom: 10px;
    }
    
    input {
        background-color: ${props => props.theme.nBlue}25;
        border: 2px solid ${props => props.theme.nPurple};
        border-radius: 5px;
        box-shadow: inset 3px 3px 3px #666, inset -2px -2px 2px #fff;
        margin: 10px 0;
        outline: transparent;
        padding: 8px 14px;
        width: 100%;
    }
`;

const Error = styled.div`
    color: crimson;
    font-size: 12px;
    text-align: center;
`;