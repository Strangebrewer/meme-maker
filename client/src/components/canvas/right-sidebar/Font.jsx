import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import FontFaceObserver from 'fontfaceobserver';
import Icon from '@mdi/react';
import {
    mdiBlurLinear,
    mdiBlurRadial,
    mdiFormatColorFill,
    mdiPaletteOutline
} from '@mdi/js';

import Popup, { PopupContent } from '../../elements/Popup';
import { SidebarSection, ToolbarButton } from '../styles';

const FONTS = [
    'Times New Roman',
    'Open Sans',
    'Courier New',
    'VT323'
]

const Font = ({ getFabric, selected }) => {
    const [disabled, setDisabled] = useState(!selected);
    const [show, setShow] = useState(false);
    const [top, setTop] = useState(null);
    const [left, setLeft] = useState(null);
    const [faunt, setFaunt] = useState('Open Sans');
    const [fauntColor, setFauntColor] = useState('#000');
    const [strokeColor, setStrokeColor] = useState(null);
    const [strokeWidth, setStrokeWidth] = useState(null);

    useEffect(() => {
        setDisabled(!selected);
    }, [selected]);

    function closePopup() {
        setShow(false);
        setTop(null);
        setLeft(null);
    }

    function openPopup(event) {
        setTop(event.clientY + 20);
        setLeft(event.clientX - 200);
        setShow(true);
    }

    function setFont(event) {
        const { value } = event.target;
        new FontFaceObserver(value, {});
        setFaunt(value);
        selected.set({
            fontFamily: value
        });
        getFabric().requestRenderAll();
    }

    function setFontColor() {

    }

    const opacity = !disabled ? '1' : '.5';
    const cursor = !disabled ? 'pointer' : 'default';

    return (
        <SidebarSection>
        <Popup
            show={show}
            top={top}
            left={left}
            close={closePopup}
        >
            <PopupContent>
                <SketchPicker onChange={setFontColor} color={fauntColor} />
            </PopupContent>
        </Popup>

            <h4>Font</h4>
            <select
                onChange={setFont}
                value={faunt}
            >
                {FONTS.map((item, i) => (
                    <option value={item} key={i}>{item}</option>
                ))}
            </select>


        <ToolbarButton
            title="choose font color"
            onClick={openPopup}
            disabled={disabled}
            style={{ cursor }}
        >
            <Icon
                path={mdiPaletteOutline}
                size={1.2}
            />
        </ToolbarButton>
        </SidebarSection>
    )
};

export default Font;
