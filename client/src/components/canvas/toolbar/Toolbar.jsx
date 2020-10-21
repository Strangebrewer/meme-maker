import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import ArrangementToolbar from './Arrangement';
import ShapesToolbar from './Shapes';
import SvgToolbar from './Svg';
import TextToolbar from './Text';
import UndoRedoToolbar from './UndoRedo';

import { ToolbarWrapper } from '../styles';

const Toolbar = (props) => {
    const history = useHistory();

    const { getFabric, selected, save, pushVersion, undo, redo } = props;

    function cancel() {
        history.push('/canvas');
    }

    return (
        <ToolbarWrapper>
            <ShapesToolbar getFabric={getFabric} pushVersion={pushVersion} />
            <TextToolbar getFabric={getFabric} pushVersion={pushVersion} />
            <ArrangementToolbar getFabric={getFabric} selected={selected} pushVersion={pushVersion} />
            <UndoRedoToolbar undo={undo} redo={redo} />
            <SvgToolbar getFabric={getFabric} pushVersion={pushVersion} />
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
