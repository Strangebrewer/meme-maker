import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
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

import { ToolbarButton } from '../styles';

const GroupAlignment = ({ getFabric, getScale, selected }) => {
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

    function groupAlignLeft() {
        if (!selected) return;
        updatePosition({ left: 0 });
    }

    function groupAlignRight() {
        if (!selected) return;
        const limit = selected.left + selected.width - 1;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();
        
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { width } = obj.getBoundingRect(true);
            let left = limit - (obj.width * obj.scaleX);

            if (obj.angle) {
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
                left = limit;

                if (a > 0 && a <= 90) {
                    left -= width;
                }
                
                if (a > 90 && a < 180) {
                    const angle = 180 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    left -= leg;
                }

                if (a > 270 && a < 360) {
                    const angle = 360 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    left -= (width - leg);
                };
            }

            if (obj.strike && !obj.angle) {
                left -= obj.strokeWidth;
            }

            obj.set({ left });
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
    }

    function groupAlignTop() {
        if (!selected) return;
        updatePosition({ top: 0 });
    }







    function groupAlignBottom() {
        if (!selected) return;
        const floor = selected.top + selected.height - 1;
        const objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();
        
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { height } = obj.getBoundingRect(true);
            let top = floor - (obj.height * obj.scaleY);

            if (obj.angle) {
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
                top = floor;

                if (a > 0 && a <= 90) {
                    top -= height;
                }
                
                if (a > 90 && a < 180) {
                    const angle = 180 - a;
                    const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                    const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                    top -= leg;
                }

                if (a > 270 && a < 360) {
                    const angle = 360 - a;
                    const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                    const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                    top -= (height - leg);
                };
            }

            if (obj.stroke && !obj.angle) {
                top -= obj.strokeWidth;
            }

            obj.set({ top });
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
    }












    function groupCenterHorizontally() {
        if (!selected) return;
        const { width } = selected.getBoundingRect(true);
        let left
        updatePosition({ left });
    }

    function groupCenterVertically() {
        if (!selected) return;
        const { height } = selected.getBoundingRect(true);
        let top
        updatePosition({ top });
    }

    function distributeHorizontally() {
        if (!selected) return;
        if (selected.type !== 'activeSelection') return;

        const objects = selected.getObjects();
        const { width } = selected.getBoundingRect(true);

        getFabric().discardActiveObject();

        objects.sort((a, b) => (a.left > b.left) ? 1 : -1);
        let leftMostObject = objects[0];
    }

    function distributeVertically() {

    }

    const cursor = !disabled ? 'pointer' : 'default';
    const isDistributable = selected && selected.type === 'activeSelection' && selected._objects.length > 2;
    const isGroup = selected && selected.type === 'activeSelection';
    const cursorTwo = isDistributable ? 'pointer' : 'default';

    return (
        <>
            <ToolbarButton title="align left" onClick={groupAlignLeft} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignHorizontalLeft} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="align right" onClick={groupAlignRight} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignHorizontalRight} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="align top" onClick={groupAlignTop} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignVerticalTop} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="align bottom" onClick={groupAlignBottom} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignVerticalBottom} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="center horizontally" onClick={groupCenterHorizontally} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignHorizontalCenter} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="center vertically" onClick={groupCenterVertically} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignVerticalCenter} size={1.1} />
            </ToolbarButton>
            
            <ToolbarButton title="distribute horizontally" onClick={distributeHorizontally} disabled={!isDistributable} style={{ cursor: cursorTwo }}>
                <Icon path={mdiDistributeHorizontalCenter} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="distribute vertically" onClick={distributeVertically} disabled={!isDistributable} style={{ cursor: cursorTwo }}>
                <Icon path={mdiDistributeVerticalCenter} size={1.1} />
            </ToolbarButton>
        </>
    )
}

export default GroupAlignment;
