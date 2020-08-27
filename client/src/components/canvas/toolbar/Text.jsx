import React from 'react';
import { addText, addCalendar } from '../fabric-handlers/text';
import Icon from '@mdi/react';
import { mdiFormatTextbox, mdiCalendarMonthOutline } from '@mdi/js';

import { ToolbarButton } from '../styles';

const Text = ({ getFabric }) => {
    function newText() {
        addText(getFabric);
    }

    function newCalendar() {
        addCalendar(getFabric);
    }

    return (
        <>
            <ToolbarButton onClick={newText}>
                <Icon
                    path={mdiFormatTextbox}
                    title="add textbox"
                    size={1.2}
                />
            </ToolbarButton>

            <ToolbarButton onClick={newCalendar}>
                <Icon
                    path={mdiCalendarMonthOutline}
                    title="add calendar"
                    size={1.2}
                />
            </ToolbarButton>
        </>
    )
}

export default Text;
