import React, { useEffect, useState } from 'react';
import { SidebarWrapper } from '../styles';
import Alignment from './Alignment';
import Border from './Border';
import Fill from './Fill';
import Font from './Font';
import Position from './Position';
import ScreenSize from './ScreenSize';
import Shadow from './Shadow';
import Size from './Size';

let count = 0;

const Sidebar = ({ getFabric, selected, dimensions, setDimensions }) => {
    const [state, setState] = useState({
        screenSize: false,
        alignment: false,
        size: false,
        position: false,
        fill: false,
        shadow: false,
        border: false,
        font: false
    });

    useEffect(() => {
        setState({
            screenSize: !selected,
            alignment: selected ? selected.hasTag('position') : false,
            size: selected ? selected.hasTag('size') : false,
            position: selected ? selected.hasTag('position') : false,
            fill: selected ? selected.hasTag('fill') : false,
            shadow: selected ? selected.hasTag('shadow') : false,
            border: selected ? selected.hasTag('border') : false,
            font: selected ? selected.hasTag('font') : false
        })
    }, [selected])

    function hasTag(tag) {
        count++;
        console.log(`hasTag running! This makes ${count} times!`);
        return selected && ((selected.hasTag && selected.hasTag(tag)) || selected.type === 'group');
    }

    return (
        <SidebarWrapper right>
            {state.screenSize && <ScreenSize selected={selected} dimensions={dimensions} setDimensions={setDimensions} />}
            {state.position && <Alignment hasTag={hasTag} getFabric={getFabric} selected={selected} />}
            {state.size && <Size hasTag={hasTag} getFabric={getFabric} selected={selected} />}
            {state.position && <Position hasTag={hasTag} getFabric={getFabric} selected={selected} />}
            {state.fill && <Fill hasTag={hasTag} getFabric={getFabric} selected={selected} />}
            {state.shadow && <Shadow hasTag={hasTag} getFabric={getFabric} selected={selected} />}
            {state.border && <Border hasTag={hasTag} getFabric={getFabric} selected={selected} />}
            {state.font && <Font hasTag={hasTag} getFabric={getFabric} selected={selected} />}
        </SidebarWrapper>
    )
}

export default Sidebar;