import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiAlignHorizontalCenter,
    mdiAlignHorizontalLeft,
    mdiAlignHorizontalRight,
    mdiAlignVerticalBottom,
    mdiAlignVerticalCenter,
    mdiAlignVerticalTop,
    mdiDistributeHorizontalCenter,
    mdiDistributeVerticalCenter
} from '@mdi/js';

import GroupAlignment from './GroupAlignment';



import { SidebarSection, ToolbarButton } from '../styles';

const Alignment = ({ getFabric, getScale, selected }) => {
    const [disabled, setDisabled] = useState(!(selected && selected.hasTag && selected.hasTag('position')));

    useEffect(() => {
        setDisabled(!(selected && selected.hasTag && selected.hasTag('position')));
    }, [selected]);

    function setAndSelect(update) {
        selected.set(update);
        selected.setCoords();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
    }

    function updatePosition(coords) {
        const bb = selected.getBoundingRect(true);
        const update = {};

        for (const key in coords) {
            if (coords[key] === '') coords[key] = 0;

            const coord = parseFloat(coords[key]);
            if (Number.isNaN(coord)) continue;
            if (bb[key] === coord) continue;

            if (bb[key] > coord) {
                const diff = bb[key] - coord;
                update[key] = parseFloat(selected[key] - diff);
            }

            if (bb[key] < coord) {
                const diff = coord - bb[key];
                update[key] = parseFloat(selected[key] + diff);
            }
        }

        if (Object.keys(update).length) {
            setAndSelect(update);
        }
    }

    function alignLeft() {
        if (!selected) return;
        updatePosition({ left: 0 });
    }

    function alignTop() {
        if (!selected) return;
        updatePosition({ top: 0 });
    }

    function alignRight() {
        if (!selected) return;
        const { width } = selected.getBoundingRect(true);
        const cvWidth = getFabric().width / getScale();
        const left = Math.floor(cvWidth - width);
        updatePosition({ left });
    }

    function alignBottom() {
        if (!selected) return;
        const { height } = selected.getBoundingRect(true);
        const cvHeight = getFabric().height / getScale();
        const top = Math.floor(cvHeight - height);
        updatePosition({ top });
    }

    function centerHorizontally() {
        if (!selected) return;
        const { width } = selected.getBoundingRect(true);
        const cvWidth = getFabric().width / getScale();
        const left = (cvWidth - width) / 2;
        updatePosition({ left });
    }

    function centerVertically() {
        if (!selected) return;
        const { height } = selected.getBoundingRect(true);
        const cvHeight = getFabric().height / getScale();
        const top = (cvHeight - height) / 2;
        updatePosition({ top });
    }

    const cursor = !disabled ? 'pointer' : 'default';
    const isDistributable = selected && selected.type === 'activeSelection' && selected._objects.length > 2;
    const isGroup = selected && selected.type === 'activeSelection';

    return (
        <SidebarSection>
            <h4>Alignment</h4>
            {isGroup
                ? (
                    <GroupAlignment getFabric={getFabric} getScale={getScale} selected={selected} />
                ) : (
                    <>
                        <ToolbarButton title="align left" onClick={alignLeft} disabled={disabled} style={{ cursor }}>
                            <Icon path={mdiAlignHorizontalLeft} size={1.1} />
                        </ToolbarButton>
                        
                        <ToolbarButton title="align right" onClick={alignRight} disabled={disabled} style={{ cursor }}>
                            <Icon path={mdiAlignHorizontalRight} size={1.1} />
                        </ToolbarButton>
            
                        <ToolbarButton title="align top" onClick={alignTop} disabled={disabled} style={{ cursor }}>
                            <Icon path={mdiAlignVerticalTop} size={1.1} />
                        </ToolbarButton>
            
                        <ToolbarButton title="align bottom" onClick={alignBottom} disabled={disabled} style={{ cursor }}>
                            <Icon path={mdiAlignVerticalBottom} size={1.1} />
                        </ToolbarButton>
            
                        <ToolbarButton title="center horizontally" onClick={centerHorizontally} disabled={disabled} style={{ cursor }}>
                            <Icon path={mdiAlignHorizontalCenter} size={1.1} />
                        </ToolbarButton>
            
                        <ToolbarButton title="center vertically" onClick={centerVertically} disabled={disabled} style={{ cursor }}>
                            <Icon path={mdiAlignVerticalCenter} size={1.1} />
                        </ToolbarButton>
                    </>
                )
            }
        </SidebarSection>
    )
}

export default Alignment;
