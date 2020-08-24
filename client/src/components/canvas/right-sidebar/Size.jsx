import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import {
    mdiArrowExpandAll,
    mdiArrowExpandHorizontal,
    mdiArrowExpandVertical,
} from '@mdi/js';

import { InputGroup, SidebarSection, ToolbarButton } from '../styles';

const Size = ({ getFabric, getScale, selected }) => {
    const [disabled, setDisabled] = useState(!(selected && selected.hasTag && selected.hasTag('size')));
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(parseInt(selected ? selected.width * selected.scaleX : 0));
        setHeight(parseInt(selected ? selected.height * selected.scaleY : 0));
        setDisabled(!(selected && selected.hasTag && selected.hasTag('size')));
    }, [selected]);

    function validate(input) {
        if (!input) return 0;
        let number = parseFloat(input);
        if (typeof number !== 'number' || Number.isNaN(number)) return 0;
        return number;
    }

    function keepGradient(dimension, direction) {
        const gradient = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            colorStops: {
                '0': selected.fill.colorStops[0].color,
                '1': selected.fill.colorStops[1].color
            }
        }
        if (typeof selected.fill === 'object') {
            if (direction === 'h') {
                gradient.x2 = dimension;
            }
            if (direction === 'v') {
                gradient.y2 = dimension;
            }
            selected.setGradient('fill', gradient);
        }
    }

    function updateWidth(event) {
        if (!selected) return;
        const number = validate(event.target.value);

        setWidth(number);
        /**  to get the new radius:
         * because the circle may have been manually stretched, which affects scale,
         * this will need to be calculated from the selected object's properties (e.g. radius and scales) */

        keepGradient(number, 'h');

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

        keepGradient(number, 'v');

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
        const cvWidth = getFabric().width / getScale();
        let modifier = 0;
        if (selected.stroke) modifier = selected.strokeWidth;

        setWidth(cvWidth - modifier);

        keepGradient((cvWidth - modifier))

        selected.set({ scaleX: 1, left: 0, width: cvWidth - modifier });
        selected.setCoords();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
    }

    function stretchV() {
        if (!selected) return;
        const cvHeight = getFabric().height / getScale();
        let modifier = 0;
        if (selected.stroke) modifier = selected.strokeWidth;

        setHeight(parseInt(cvHeight - modifier));
        
        selected.set({ scaleY: 1, top: 0, height: cvHeight - modifier });
        selected.setCoords();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
    }

    function stretchAll() {
        if (!selected) return;
        stretchH();
        stretchV();
    }

    const opacity = !disabled ? '1' : '.5';
    const cursor = !disabled ? 'pointer' : 'default';

    return (
        <SidebarSection>
            <h4>Size</h4>
            <InputGroup>
                <label style={{ opacity }}>width</label>
                <input type="text" onChange={updateWidth} value={width} disabled={disabled} style={{ opacity }} />
            </InputGroup>

            <InputGroup>
                <label style={{ opacity }}>height</label>
                <input type="text" onChange={updateHeight} value={height} disabled={disabled} style={{ opacity }} />
            </InputGroup>

            {/* <div> */}
            <ToolbarButton title="stretch horizontally" onClick={stretchH} disabled={disabled} style={{ cursor }}>
                <Icon path={mdiArrowExpandHorizontal} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="stretch vertically" onClick={stretchV} disabled={disabled} style={{ cursor }}>
                <Icon path={mdiArrowExpandVertical} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="stretch vertically" onClick={stretchAll} disabled={disabled} style={{ cursor }}>
                <Icon path={mdiArrowExpandAll} size={1.1} />
            </ToolbarButton>
            {/* </div> */}
        </SidebarSection>
    );
};

export default Size;
