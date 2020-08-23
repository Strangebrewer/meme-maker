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

const Sidebar = ({ getFabric, selected, dimensions, setDimensions }) => {
    const [state, setState] = useState({
        screenSize: false,
        fill: false,
        shadow: false,
        border: false,
        font: false
    });

    useEffect(() => {
        setState({
            screenSize: !selected,
            fill: selected ? selected.hasTag('fill') : false,
            shadow: selected ? selected.hasTag('shadow') : false,
            border: selected ? selected.hasTag('border') : false,
            font: selected ? selected.hasTag('font') : false
        })
    }, [selected]);

    return (
        <SidebarWrapper right>
            <Alignment getFabric={getFabric} selected={selected} />
            <Size getFabric={getFabric} selected={selected} />
            <Position getFabric={getFabric} selected={selected} />
            {state.screenSize && <ScreenSize selected={selected} dimensions={dimensions} setDimensions={setDimensions} />}
            {state.fill && <Fill getFabric={getFabric} selected={selected} />}
            {state.shadow && <Shadow getFabric={getFabric} selected={selected} />}
            {state.border && <Border getFabric={getFabric} selected={selected} />}
            {state.font && <Font getFabric={getFabric} selected={selected} />}
        </SidebarWrapper>
    )
}

export default Sidebar;