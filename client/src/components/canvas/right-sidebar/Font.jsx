import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import FontFaceObserver from 'fontfaceobserver';
import Icon from '@mdi/react';
import {
    mdiFormatAlignCenter,
    mdiFormatAlignJustify,
    mdiFormatAlignLeft,
    mdiFormatAlignRight,
    mdiFormatBold,
    mdiFormatItalic
} from '@mdi/js';

import Popup, { PopupContent } from '../../elements/Popup';
import { SidebarSection, ToolbarButton } from '../styles';

const FONTS = [
    'Times New Roman',
    'Open Sans',
    'Courier New',
    'VT323'
]

const Font = ({ getFabric, selected, pushVersion }) => {
    const [faunt, setFaunt] = useState(selected ? selected.fontFamily : 'OpenSans');
    const [bauld, setBauld] = useState(selected ? selected.fontWeight : 400);
    const [italic, setItalica] = useState(selected ? selected.fontStyle : 'normal');
    const [alignment, setAlignment] = useState(selected ? selected.textAlign : 'left');

    function setFont(event) {
        const { value } = event.target;
        new FontFaceObserver(value, {});
        setFaunt(value);
        selected.set({
            fontFamily: value
        });
        getFabric().requestRenderAll();
        pushVersion();
    }

    function setBold() {
        const change = bauld === 400 ? 700 : 400;
        setBauld(change);
        selected.set({ fontWeight: change });
        getFabric().requestRenderAll();
        pushVersion();
    }

    function setItalic() {
        const change = italic === 'normal' ? 'italic' : 'normal';
        setItalica(change);
        selected.set({ fontStyle: change });
        getFabric().requestRenderAll();
        pushVersion();
    }

    function setTextAlignment(value) {
        setAlignment(value);
        selected.set({ textAlign: value });
        getFabric().requestRenderAll();
        pushVersion();
    }

    return (
        <SidebarSection>
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
                onClick={setBold}
                active={bauld === 700}
            >
                <Icon
                    path={mdiFormatBold}
                    size={1.2}
                />
            </ToolbarButton>

            <ToolbarButton
                title="choose font color"
                onClick={setItalic}
                active={italic === 'italic'}
            >
                <Icon
                    path={mdiFormatItalic}
                    size={1.2}
                />
            </ToolbarButton>

            <div style={{ paddingTop: '10px' }}>
                <ToolbarButton
                    title="choose font color"
                    onClick={() => setTextAlignment('left')}
                    active={alignment === 'left'}
                >
                    <Icon
                        path={mdiFormatAlignLeft}
                        size={1.2}
                    />
                </ToolbarButton>

                <ToolbarButton
                    title="choose font color"
                    onClick={() => setTextAlignment('center')}
                    active={alignment === 'center'}
                >
                    <Icon
                        path={mdiFormatAlignCenter}
                        size={1.2}
                    />
                </ToolbarButton>

                <ToolbarButton
                    title="choose font color"
                    onClick={() => setTextAlignment('right')}
                    active={alignment === 'right'}
                >
                    <Icon
                        path={mdiFormatAlignRight}
                        size={1.2}
                    />
                </ToolbarButton>

                <ToolbarButton
                    title="choose font color"
                    onClick={() => setTextAlignment('justify')}
                    active={alignment === 'justify'}
                >
                    <Icon
                        path={mdiFormatAlignJustify}
                        size={1.2}
                    />
                </ToolbarButton>
            </div>
        </SidebarSection>
    )
};

export default Font;
