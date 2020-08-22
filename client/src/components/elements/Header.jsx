import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../App';

const Header = props => {
    const history = useHistory();
    const user = useContext(UserContext);

    function goTo(route) {
        history.push(route);
    }

    return (
        <Wrapper>
            <LinkButton onClick={() => goTo('/')}>HOME</LinkButton>
            {user && <LinkButton onClick={() => goTo('/sucka')}>SUCKA</LinkButton>}
            {user && <LinkButton onClick={() => goTo('/canvas')}>CANVAS</LinkButton>}
            {user
                ? <AuthBtn onClick={props.logout}>LOGOUT</AuthBtn>
                : <AuthBtn width="150" onClick={() => history.push('/login')}>LOGIN / SIGNUP</AuthBtn>}
        </Wrapper>
    )
};

export default Header;

const Wrapper = styled.header`
    background-color: #000;
    box-shadow: 0 5px 5px ${props => props.theme.shadow};
    min-height: 92px;
    max-height: 92px;
    padding: 30px;
    position: relative;
`;

const AuthBtn = styled.button`
    background-color: white;
    border: 2px solid ${props => props.theme.nRed};
    border-radius: 20px;
    box-shadow: inset 1px 1px 5px ${props => props.theme.blue}, inset -1px -1px 5px ${props => props.theme.blue};
    color: ${props => props.theme.purple};
    cursor: pointer;
    height: 32px;
    outline: none;
    position: absolute;
    right: 30px;
    top: 30px;
    width: ${props => props.width ? props.width : '100'}px;
`;

const LinkButton = styled.button`
    background-color: ${props => props.theme.purple};
    border: 2px solid ${props => props.theme.blue};
    border-radius: 16px;
    box-shadow: inset 1px 1px 5px white, inset -1px -1px 5px white;
    color: white;
    cursor: pointer;
    height: 32px;
    margin: 0 30px;
    outline: none;
    width: 100px;
`;