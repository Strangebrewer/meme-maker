import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiResize } from '@mdi/js';

import { InputGroup, SidebarSection, ToolbarButton } from '../styles';

const ScreenSize = ({ dimensions, setDimensions, selected }) => {
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (selected) setDisabled(true);
        else setDisabled(false);
    }, [selected]);
    
    function handleInputChange(event) {
        const { name, value } = event.target;
        setDimensions({ ...dimensions, [name]: value });
    }

    function returnToSize() {
        setDimensions({ ...dimensions, reset: true });
    }

    return (
        <SidebarSection>
                <h4>Screen Size</h4>
                <InputGroup>
                    <label>width:</label>
                    <input
                        type="text"
                        name="width"
                        value={dimensions.width}
                        disabled={disabled}
                        onChange={handleInputChange}
                    />
                </InputGroup>

                <InputGroup>
                    <label>height:</label>
                    <input
                        type="text"
                        name="height"
                        value={dimensions.height}
                        onChange={handleInputChange}
                    />
                </InputGroup>

                <ToolbarButton height="22" onClick={returnToSize}>
                    <Icon
                        path={mdiResize}
                        title="add circle"
                        size={1.2}
                    />
                </ToolbarButton>
        </SidebarSection>
    )
}

export default ScreenSize;
