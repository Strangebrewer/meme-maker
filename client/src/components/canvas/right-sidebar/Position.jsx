import React, { useState, useEffect } from 'react';

import { InputGroup, SidebarSection } from '../styles';

function Position({ getFabric, selected }) {
    const [disabled, setDisabled] = useState(!(selected && selected.hasTag('position')));
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        if (selected) {
            setLeft(parseInt(selected.left * selected.scaleX));
            setTop(parseInt(selected.top * selected.scaleY));
            setAngle(parseInt(selected.angle));
        } else {
            setLeft(0);
            setTop(0);
            setAngle(0);
        }
        setDisabled(!(selected && selected.hasTag('position')));
    }, [selected]);

    function validate(input) {
        if (!input) return '';
        let number = parseFloat(input);
        if (typeof number !== 'number' || Number.isNaN(number)) return 0;
        return number;
    }

    function updateLeft(event) {
        if (!selected) return;
        const number = validate(event.target.value);
        setLeft(number);
        if (number === '') {
            selected.set({ left: 0 });
        } else {
            selected.set({ left: parseFloat(number) });
        }
        selected.setCoords();
        getFabric().requestRenderAll();
    }

    function updateTop(event) {
        if (!selected) return;
        const number = validate(event.target.value);
        setTop(number);
        selected.set({ top: parseFloat(number) });
        selected.setCoords();
        getFabric().requestRenderAll();
    }

    function rotate(event) {
        if (!selected) return;
        const number = validate(event.target.value);
        setAngle(number);
        selected.rotate(number);
        selected.setCoords();
        getFabric().requestRenderAll();
    }
    const opacity = !disabled ? '1' : '.5';

    return (
        <SidebarSection>
            <h4>Position</h4>
            <InputGroup>
                <label style={{ opacity }}>pos x</label>
                <input type="text" onChange={updateLeft} value={left} disabled={disabled} style={{ opacity }} />
            </InputGroup>

            <InputGroup>
                <label style={{ opacity }}>pos y</label>
                <input type="text" onChange={updateTop} value={top} disabled={disabled} style={{ opacity }} />
            </InputGroup>

            <InputGroup>
                <label style={{ opacity }}>angle</label>
                <input type="text" onChange={rotate} value={angle} disabled={disabled} style={{ opacity }} />
            </InputGroup>
        </SidebarSection>
    );
};

export default Position;