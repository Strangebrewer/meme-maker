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

         <Button5
            disabled={!username || !password || !confirmation}
            onClick={enterSandman}
         >
            Abandon all hope...
         </Button5>

         <Error>{error}</Error>
      </Form>
   )

}

export default Signup;

const Form = styled.form`
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