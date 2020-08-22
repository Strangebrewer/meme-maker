import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import {
    mdiArrowExpandAll,
    mdiArrowExpandHorizontal,
    mdiArrowExpandVertical,
} from '@mdi/js';

import { InputGroup, SidebarSection, ToolbarButton } from '../styles';

const Size = ({ getFabric, selected, hasTag }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(parseInt(selected ? selected.width * selected.scaleX : 0));
        setHeight(parseInt(selected ? selected.height * selected.scaleY : 0));
    }, [selected]);

    function validate(input) {
        if (!input) return 0;
        let number = parseFloat(input);
        if (typeof number !== 'number' || Number.isNaN(number)) return 0;
        return number;
    }

    function updateWidth(event) {
        if (!selected) return;
        const number = validate(event.target.value);

        setWidth(number);
        /**  to get the new radius:
         * because the circle may have been manually stretched, which affects scale,
         * this will need to be calculated from the selected object's properties (e.g. radius and scales) */

        if (selected.type === 'k-circle') {
            selected.set('radius', number / 2);
        } else {
            selected.set({ width: parseFloat(number), scaleX: 1 });
        }
        selected.setCoords();
        getFabric().requestRenderAll();
    }

    function updateHeight(event) {
        if (!selected) return;
        const number = validate(event.target.value);

        setHeight(number);

        if (selected.type === 'k-circle') {
            selected.set('radius', number / 2);
        } else {
            selected.set({ height: parseFloat(number), scaleY: 1 });
        }
        selected.setCoords();
        getFabric().requestRenderAll();
    }

    function stretchH() {
        if (!selected) return;
        const cvWidth = getFabric().width
        let modifier = 0;
        if (selected.stroke) modifier = selected.strokeWidth;

        setWidth(parseInt(cvWidth - modifier));

        const { width } = selected;
        const scaleX = parseFloat(parseInt(cvWidth - modifier) / width);
        selected.set({ scaleX, left: 0 });

        selected.setCoords();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
    }

    function stretchV() {
        if (!selected) return;
        const cvHeight = getFabric().height
        let modifier = 0;
        if (selected.stroke) modifier = selected.strokeWidth;

        setHeight(parseInt(cvHeight - modifier));

        const { height } = selected;
        const scaleY = parseFloat(parseInt(cvHeight - modifier) / height);
        selected.set({ scaleY, top: 0 });

        selected.setCoords();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
    }

    function stretchAll() {
        if (!selected) return;
        stretchH();
        stretchV();
    }

    const opacity = hasTag('size') ? '1' : '.5';
    const cursor = hasTag('position') ? 'pointer' : 'default';

    return (
        <SidebarSection>
            <h4>Size</h4>
            <InputGroup>
                <label style={{ opacity }}>width</label>
                <input type="text" onChange={updateWidth} value={width} disabled={!hasTag('size')} style={{ opacity }} />
            </InputGroup>

            <InputGroup>
                <label style={{ opacity }}>height</label>
                <input type="text" onChange={updateHeight} value={height} disabled={!hasTag('size')} style={{ opacity }} />
            </InputGroup>

            {/* <div> */}
                <ToolbarButton title="stretch horizontally" onClick={stretchH} disabled={!hasTag('size')} style={{ cursor }}>
                    <Icon path={mdiArrowExpandHorizontal} size={1.1} />
                </ToolbarButton>

                <ToolbarButton title="stretch vertically" onClick={stretchV} disabled={!hasTag('size')} style={{ cursor }}>
                    <Icon path={mdiArrowExpandVertical} size={1.1} />
                </ToolbarButton>

                <ToolbarButton title="stretch vertically" onClick={stretchAll} disabled={!hasTag('size')} style={{ cursor }}>
                    <Icon path={mdiArrowExpandAll} size={1.1} />
                </ToolbarButton>
            {/* </div> */}
        </SidebarSection>
    );
};

export default Size;
