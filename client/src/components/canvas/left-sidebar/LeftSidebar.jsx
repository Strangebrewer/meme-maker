import React from 'react';
import ImagesList from './ImagesList';

import { SidebarWrapper } from '../styles';

const Sidebar = ({ getFabric, getScale, pushVersion, selected }) => {
    function hasTag(tag) {
        return selected && ((selected.hasTag && selected.hasTag(tag)) || selected.type === 'group');
    }

    return (
        <SidebarWrapper left>
            <ImagesList
                getFabric={getFabric}
                getScale={getScale}
                pushVersion={pushVersion}
            />
        </SidebarWrapper>
    )
}

export default Sidebar;