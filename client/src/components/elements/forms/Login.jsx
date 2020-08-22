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
            <Button5
                disabled={!username || !password}
                onClick={enterSandman}
            >
                Abandon all hope...
         </Button5>
            <Error>{error}</Error>
        </Form>
    )

}

export default Login;

const Form = styled.form`
   border-right: 1px solid ${props => props.theme.grey4};
   height: 300px;
   margin: auto 0;
   padding: 20px 60px;
   position: relative;
   text-align: left;
   transition: transform .3s, opacity .35s;
   width: 360px;
   h3 {
      font-size: 36px;
      margin-bottom: 10px;
   }
   input {
      width: 100%;
      padding: 3px 6px;
      margin: 10px 0;
   }
`;

const Button5 = styled.button`
   background: ${props => props.theme.danger};
   border: none;
   color: black;
   cursor: pointer;
   margin: auto;
   position: absolute;
   bottom: 35px;
   left: 0;
   right: 0;
   :active {
      outline: none;
      transform: translateY(2px);
   }
`;

const Error = styled.div`
   color: crimson;
   font-size: 12px;
   text-align: center;
`;