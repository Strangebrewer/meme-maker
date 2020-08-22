import React from 'react';
import styled from 'styled-components';

const Menu = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    z-index: 100;
`;

const Wrapper = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    background-color: #00000000;
    height: 100vh;
    width: 100vw;
    z-index: 99;
`;

export const PopupContent = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 5px 5px 5px #333, -1px -1px 3px #e5e5e5;
    padding: 15px 20px;
`;

export const PopupButton = styled.button`
    background: transparent;
    border: none;
    display: flex;
    &:hover {
        cursor: pointer;
    }
`;

const Popup = props => {
    const onOutsideClick = e => {
        console.log('e.target.className:::', e.target.className);
        if (e.target.className.includes('popup-wrapper')) {
            props.close()
        }
    }

    return (
        <Wrapper className="popup-wrapper" onClick={onOutsideClick} show={props.show}>
            <Menu
                show={props.show}
                top={props.top}
                left={props.left}
                id="arrangement-popup"
            >
                {props.children}
            </Menu>
        </Wrapper>
    )
}

export default Popup;
