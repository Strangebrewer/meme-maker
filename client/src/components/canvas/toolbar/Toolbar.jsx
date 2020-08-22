import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import ArrangementToolbar from './Arrangement';
import ShapesToolbar from './Shapes';
import TextToolbar from './Text';

import { ToolbarWrapper } from '../styles';

const SCREEN_DIMENSIONS = [
    '3840 x 2160',
    '1920 x 1080',
    '1600 x 900',
    '1368 x 768'
]

const Toolbar = (props) => {
    const history = useHistory();

    const { getFabric, selected, save } = props;

    function cancel() {
        history.push('/canvas');
    }

    return (
        <ToolbarWrapper>
            <ShapesToolbar getFabric={getFabric} />
            <TextToolbar getFabric={getFabric} />
            <ArrangementToolbar getFabric={getFabric} selected={selected} />
            <Buttons>
                <button onClick={save}>Save</button>
                <button onClick={cancel}>Cancel</button>
            </Buttons>
        </ToolbarWrapper>
    )
};

export default Toolbar;

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    position: absolute;
    right: 20px;
    top: 18px;
    width: 100px;
    button {
        background-color: transparent;
        border: none;
        color: ${props => props.theme.blue};
        cursor: pointer;
        font-weight: bold;
        outline: none;
    }
    button:last-of-type {
        color: ${props => props.theme.red};
    }
`;
