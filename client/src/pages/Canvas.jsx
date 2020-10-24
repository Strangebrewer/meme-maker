import React from 'react';

import FabricCanvas from '../components/canvas/FabricCanvas';
import Header from '../components/elements/Header';

import { PageWrapper } from './styles'; 

const Canvas = props => {
    return (
        <PageWrapper>
            <Header page="canvas" logout={props.logout} />
            <FabricCanvas templateId={props.match.params.id} />
        </PageWrapper>
    )
}

export default Canvas;
