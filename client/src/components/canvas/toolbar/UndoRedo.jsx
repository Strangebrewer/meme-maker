import React, { useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiUndo,
    mdiRedo,
} from '@mdi/js';

import { ToolbarButton } from '../styles';

const UndoRedo = ({ undo, redo }) => {
    return (
        <>
            <ToolbarButton
                onClick={undo}
                title="undo"
            >
                <Icon
                    path={mdiUndo}
                    size={1.2}
                    id="undo-icon"
                />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={redo}
                title="redo"
            >
                <Icon
                    path={mdiRedo}
                    size={1.2}
                    id="redo-icon"
                />
            </ToolbarButton>
        </>
    );
}

export default UndoRedo;
