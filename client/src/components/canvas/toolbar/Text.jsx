import React from 'react';
import { addText } from '../fabric-handlers/text';
import Icon from '@mdi/react';
import { mdiFormatTextbox } from '@mdi/js';

import { ToolbarButton } from '../styles';

const Text = ({ getFabric }) => {
    function newText () {
        addText(getFabric);
    }
    return (
        <ToolbarButton onClick={newText}>
            <Icon
                path={mdiFormatTextbox}
                title="add textbox"
                size={1.2}
            />
        </ToolbarButton>
    )
}

export default Text;
