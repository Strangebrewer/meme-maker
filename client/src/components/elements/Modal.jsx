import React, { useState } from 'react';
import styled from 'styled-components';

const Modal = props => {
    function onOutsideClick(e) {
        if (e.target.className.includes('modal-wrapper')) {
            props.close()
        }
    }

    return (
        <Wrapper
            className="modal-wrapper"
            onClick={onOutsideClick}
            show={props.show}
        >
            <Content show={props.show}>
                <CloseBtn onClick={props.close}>&times;</CloseBtn>
                <Body>
                    {props.items && props.items.map((item, i) => (
                        <div key={i}>
                            <label style={{ display: 'block', width: '100%', color: 'white', fontSize: '16px', marginBottom: '10px' }}>{item.label}</label>
                            <input
                                type="text"
                                name={item.label.toLowerCase()}
                                onChange={props.handler}
                                style={{ width: '100%', marginBottom: '20px' }}
                            />
                        </div>
                    ))}
                    {props.content && props.content}
                    <Buttons>
                        {props.callback && <button onClick={props.callback}>OK</button>}
                        {props.close && props.callback && <button onClick={props.close}>Close</button>}
                    </Buttons>
                </Body>
            </Content>
        </Wrapper>
    )
}

export default Modal;

const Wrapper = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    display: ${props => props.show ? 'flex' : 'none'};
    height: 100%;
    overflow: auto;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 99;
`;

const Content = styled.div`
    animation-duration: 0.4s;
    animation-name: fadein;
    background: linear-gradient(rgba(38, 212, 204, 0.267), rgba(38, 212, 204, 0.267)),
        linear-gradient(rgb(0,0,0), rgb(0,0,0));
    border: 1px solid rgb(38, 212, 204);
    border-radius: 12px;
    box-shadow: 0 0 1px #000,
        0 0 2px #000,
        0 0 4px #000,
        0 0 8px #111,
        0 0 10px #111,
        0 0 20px #222,
        0 0 40px #aaa,
        inset 0 0 100px 30px rgb(0,0,0);
    display: ${props => props.show ? 'block' : 'none'};
    font-size: 1.8rem;
    max-width: 60%;
    min-width: 300px;
    margin: auto;
    padding: 0;
    position: relative;
    img {
        border: 1px solid black;
    }
    @keyframes fadein {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const Body = styled.div`
    margin: auto;
    max-width: 100%;
    padding: 40px;
    z-index: 999;
`;

const Buttons = styled.div`
    text-align: center;
    width: 100%;
    button, a {
        background-color: #1d928c;
        border: none;
        border-radius: 5px;
        color: #fff;
        display: ${props => props.center ? 'block' : 'inline'};
        font-size: ${props => props.full && '1.8rem'};
        height: ${props => props.full && '40px'};
        margin: 15px 15px 0 0;
        outline: transparent;
        padding: 8px 12px;
        text-shadow: 0 0 5px #000;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        width: 80px;
    }
    button:hover, a:hover {
        background-color: #26d4cc;
    }
    button:last-child {
        margin: 15px 0 0 0;
    }
`;

const CloseBtn = styled.button`
    background-color: transparent;
    border: none;
    color: lightgrey;
    font-size: 20px;
    outline: transparent;
    position: absolute;
    top: 5px;
    right: 5px;
    &:hover, &:focus {
       color: #26d4cc;
       cursor: pointer;
       text-decoration: none;
    }
`;