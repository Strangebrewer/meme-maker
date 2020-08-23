import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiAlignHorizontalCenter,
    mdiAlignHorizontalLeft,
    mdiAlignHorizontalRight,
    mdiAlignVerticalBottom,
    mdiAlignVerticalCenter,
    mdiAlignVerticalTop,
} from '@mdi/js';

import { SidebarSection, ToolbarButton } from '../styles';

const Alignment = ({ getFabric, selected }) => {
    const [disabled, setDisabled] = useState(!(selected && selected.hasTag('position')));

    useEffect(() => {
        setDisabled(!(selected && selected.hasTag('position')));
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
        const cvWidth = getFabric().width;
        const left = Math.floor(cvWidth - width);
        updatePosition({ left });
    }

    function alignBottom() {
        if (!selected) return;
        const { height } = selected.getBoundingRect(true);
        const cvHeight = getFabric().height;
        const top = Math.floor(cvHeight - height);
        updatePosition({ top });
    }

    function centerHorizontally() {
        if (!selected) return;
        const { width } = selected.getBoundingRect(true);
        const cvWidth = getFabric().width;
        const left = (cvWidth - width) / 2;
        updatePosition({ left });
    }

    function centerVertically() {
        if (!selected) return;
        const { height } = selected.getBoundingRect(true);
        const cvHeight = getFabric().height;
        const top = (cvHeight - height) / 2;
        updatePosition({ top });
    }

    const cursor = !disabled ? 'pointer' : 'default';

    return (
        <SidebarSection>
            <h4>Alignment</h4>
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

            <ToolbarButton title="horizontal center" onClick={centerHorizontally} disabled={disabled} style={{ cursor }}>
                <Icon path={mdiAlignHorizontalCenter} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="vertical center" onClick={centerVertically} disabled={disabled} style={{ cursor }}>
                <Icon path={mdiAlignVerticalCenter} size={1.1} />
            </ToolbarButton>
        </SidebarSection>
    )
}

export default Alignment;