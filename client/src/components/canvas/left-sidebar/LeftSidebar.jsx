import React from 'react';
import ImagesList from './ImagesList';

import { SidebarWrapper } from '../styles';

const Sidebar = ({ getFabric, getScale, pushVersion, selected, setDimensions }) => {
    function hasTag(tag) {
        return selected && ((selected.hasTag && selected.hasTag(tag)) || selected.type === 'group');
    }

    return (
        <SidebarWrapper left>
            <ImagesList
                getFabric={getFabric}
                getScale={getScale}
                pushVersion={pushVersion}
                setDimensions={setDimensions}
            />
        </SidebarWrapper>
    )
}

export default Sidebar;