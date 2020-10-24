import React, { useState } from 'react';
import styled from 'styled-components';

const Signup = props => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = e => {
        const { name, value } = e.target;
        switch (name) {
            case 'username': return setUsername(value);
            case 'password': return setPassword(value);
            default: setConfirmation(value);
        }
    }

    const enterSandman = async e => {
        e.preventDefault();
        if (password !== confirmation)
            return setError('Passwords do not match.');

        try {
            await props.signup({ username, password });
        } catch (e) {
            setError(e.response.data.error);
        }
    }

    return (
        <Form style={props.style}>
            <h3>Sign Up</h3>
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

            <input
                type="password"
                name="confirmation"
                value={confirmation}
                onChange={handleInputChange}
                placeholder="Confirm your password"
            />

            <button
                disabled={!username || !password || !confirmation}
                onClick={enterSandman}
            >
                Abandon all hope...
         </button>

            <Error>{error}</Error>
        </Form>
    )

}

export default Signup;

const Form = styled.form`
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