import React from 'react';
import Icon from '@mdi/react';
import { mdiResize } from '@mdi/js';

import { InputGroup, SidebarSection, ToolbarButton } from '../styles';

const ScreenSize = ({ dimensions, setDimensions, selected }) => {
    function handleInputChange(event) {
        const { name, value } = event.target;
        setDimensions({ ...dimensions, [name]: value });
    }

    function returnToSize() {
        setDimensions({ ...dimensions, reset: true });
    }

    const opacity = selected ? '.5' : '1';
    const cursor = selected ? 'default' : 'pointer';

    return (
        <SidebarSection>
                <h4>Screen Size</h4>
                <InputGroup>
                    <label style={{ opacity }}>width:</label>
                    <input
                        type="text"
                        name="width"
                        value={dimensions.width}
                        disabled={!!selected}
                        onChange={handleInputChange}
                        style={{ opacity }}
                    />
                </InputGroup>

                <InputGroup>
                    <label style={{ opacity }}>height:</label>
                    <input
                        type="text"
                        name="height"
                        value={dimensions.height}
                        disabled={!!selected}
                        onChange={handleInputChange}
                        style={{ opacity }}
                    />
                </InputGroup>

                <ToolbarButton height="22" onClick={returnToSize} style={{ opacity, cursor }} disabled={!!selected}>
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
