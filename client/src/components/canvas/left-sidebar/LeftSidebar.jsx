import React from 'react';

import { SidebarWrapper } from '../styles';

const Sidebar = ({ getFabric, selected, dimensions, setDimensions }) => {
    function hasTag(tag) {
        return selected && ((selected.hasTag && selected.hasTag(tag)) || selected.type === 'group');
    }

    return (
        <SidebarWrapper left>
            
        </SidebarWrapper>
    )
}

export default Sidebar;