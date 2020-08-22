import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import Icon from '@mdi/react';
import { mdiFormatColorFill } from '@mdi/js';

import Popup, { PopupContent } from '../../elements/Popup';
import { InputGroup, ToolbarButton, SidebarSection } from '../styles';

const Shadow = ({ getFabric, selected, hasTag }) => {
    const shadowInit = {
        color: '#000',
        offsetX: 0,
        offsetY: 0,
        blur: 0
    }

    const [shadow, setShadow] = useState(shadowInit);
    const [show, setShow] = useState(false);
    const [top, setTop] = useState(null);
    const [left, setLeft] = useState(null);
    
    useEffect(() => {
        if (selected && selected.shadow) {
            setShadow(selected.shadow);
        } else {
            setShadow({
                color: '#000',
                offsetX: 0,
                offsetY: 0,
                blur: 0
            });
        }
    }, [selected]);

    function closePopup() {
        setShow(false);
        setTop(null);
        setLeft(null);
    }

    function openPopup(event) {
        setTop(event.clientY + 20);
        setLeft(event.clientX - 80);
        setShow(true);
    }

    function setShadowColor(color) {
        const update = { ...shadow, color: color.hex };
        setShadow(update);
        selected.setShadow(update);
        getFabric().requestRenderAll();
    }

    function handleInputChange(event) {
        const { value, name } = event.target;
        let change = 0;
        if (value !== '') change = parseInt(value);
        setShadow({ ...shadow, [name]: change });

        selected.setShadow({ ...shadow, [name]: change });
        getFabric().requestRenderAll();
    }

    const opacity = hasTag('position') ? '1' : '.5';
    const cursor = hasTag('shadow') ? 'pointer' : 'default';

    return (
        <SidebarSection>
            <Popup
                show={show}
                top={top}
                left={left}
                close={closePopup}
            >
                <PopupContent>
                    <SketchPicker onChange={setShadowColor} color={shadow.color} />
                </PopupContent>
            </Popup>

            <h4>Shadow</h4>

            <InputGroup>
                <label style={{ opacity }}>x</label>
                <input
                    type="text"
                    onChange={handleInputChange}
                    name="offsetX"
                    value={shadow.offsetX}
                    disabled={!hasTag('shadow')}
                    style={{ opacity }}
                />
            </InputGroup>

            <InputGroup>
                <label style={{ opacity }}>y</label>
                <input
                    type="text"
                    onChange={handleInputChange}
                    name="offsetY"
                    value={shadow.offsetY}
                    disabled={!hasTag('shadow')}
                    style={{ opacity }}
                />
            </InputGroup>

            <InputGroup>
                <label style={{ opacity }}>blur</label>
                <input
                    type="text"
                    onChange={handleInputChange}
                    name="blur"
                    value={shadow.blur}
                    disabled={!hasTag('shadow')}
                    style={{ opacity }}
                />
            </InputGroup>


            <ToolbarButton
                title="choose shadow color"
                onClick={openPopup}
                disabled={!hasTag('shadow')}
                style={{ cursor }}
            >
                <Icon
                    path={mdiFormatColorFill}
                    size={1.2}
                />
            </ToolbarButton>

        </SidebarSection>
    )
}

export default Shadow;
