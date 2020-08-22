import React from 'react';
import { SidebarWrapper } from '../styles';
import Alignment from './Alignment';
import Border from './Border';
import Fill from './Fill';
import Position from './Position';
import ScreenSize from './ScreenSize';
import Shadow from './Shadow';
import Size from './Size';

const Sidebar = ({ getFabric, selected, dimensions, setDimensions }) => {
    function hasTag(tag) {
        return selected && ((selected.hasTag && selected.hasTag(tag)) || selected.type === 'group');
    }

    return (
        <SidebarWrapper right>
            <ScreenSize selected={selected} dimensions={dimensions} setDimensions={setDimensions} />
            <Alignment hasTag={hasTag} getFabric={getFabric} selected={selected} />
            <Size hasTag={hasTag} getFabric={getFabric} selected={selected} />
            <Position hasTag={hasTag} getFabric={getFabric} selected={selected} />
            <Fill hasTag={hasTag} getFabric={getFabric} selected={selected} />
            <Shadow hasTag={hasTag} getFabric={getFabric} selected={selected} />
            <Border hasTag={hasTag} getFabric={getFabric} selected={selected} />
        </SidebarWrapper>
    )
}

export default Sidebar;