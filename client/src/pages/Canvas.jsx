import React from 'react';
import styled from 'styled-components';

import FabricCanvas from '../components/canvas/FabricCanvas';
import Header from '../components/elements/Header';

const Canvas = props => {
    return (
        <Wrapper>
            <Header page="canvas" logout={props.logout} />
            <FabricCanvas templateId={props.match.params.id} />
        </Wrapper>
    )
}

export default Canvas;

const Wrapper = styled.div`
    background-color: #1b1e24;
    min-height: 100vh;
`;
