import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import Icon from '@mdi/react';
import { mdiPaletteOutline } from '@mdi/js';

import Popup, { PopupContent } from '../../elements/Popup';
import { InputGroup, SidebarSection, ToolbarButton } from '../styles';

const Border = ({ getFabric, selected }) => {
    const [disabled, setDisabled] = useState(!selected);
    const [show, setShow] = useState(false);
    const [top, setTop] = useState(null);
    const [left, setLeft] = useState(null);
    const [color, setColor] = useState(selected && selected.stroke ? selected.stroke : '#000');
    const [width, setWidth] = useState(selected ? selected.strokeWidth : '1');

    useEffect(() => {
        setColor(selected && selected.stroke ? selected.stroke : '#000');
        setWidth(selected ? selected.strokeWidth : '1');
        setDisabled(!selected);
    }, [selected]);

    function setAndSelect() {
        selected.setCoords();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
    }

    function openColorPopup(event) {
        setTop(event.clientY - 350);
        setLeft(event.clientX - 80);
        setShow(true);
    }

    function closePopup() {
        setShow(false);
        setTop(null);
        setLeft(null);
    }

    function setColorMang(color) {
        setColor(color.hex);
        selected.set('stroke', color.hex);
        getFabric().requestRenderAll();
    }

    function updateStrokeWidth(event) {
        let width = parseInt(event.target.value);
        let { value } = event.target;
        if (!width || width < 1) {
            setWidth('');
            selected.set({ strokeWidth: 0 });
        } else if (width > 20) {
            setWidth('20');
            selected.set({ strokeWidth: 20 });
        } else {
            setWidth(value);
            selected.set({ strokeWidth: width });
        }
        getFabric().requestRenderAll();
    }

    const cursor = !disabled ? 'pointer' : 'default';
    const opacity = !disabled ? '1' : '.5';

    return (
        <SidebarSection>
            <Popup
                show={show}
                top={top}
                left={left}
                close={closePopup}
            >
                <PopupContent>
                    <SketchPicker onChange={setColorMang} color={color} />
                </PopupContent>
            </Popup>

            <h4>Border</h4>
            <ToolbarButton
                title="align left"
                onClick={openColorPopup}
                disabled={disabled}
                style={{ cursor, opacity }}
            >
                <Icon path={mdiPaletteOutline} size={1.1} />
            </ToolbarButton>

            <InputGroup>
                <input
                    type="text"
                    onChange={updateStrokeWidth}
                    onBlur={setAndSelect}
                    value={width}
                    disabled={disabled}
                    style={{ opacity }}
                />
                <span style={{ marginLeft: '-15px', opacity }}>px</span>
            </InputGroup>
        </SidebarSection>
    )
}

export default Border;