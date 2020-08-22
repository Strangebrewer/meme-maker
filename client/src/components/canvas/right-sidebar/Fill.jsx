import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import Icon from '@mdi/react';
import {
    mdiBlurLinear,
    mdiBlurRadial,
    mdiFormatColorFill,
    mdiPaletteOutline
} from '@mdi/js';

import Popup, { PopupContent } from '../../elements/Popup';
import { SidebarSection, ToolbarButton } from '../styles';

const Fill = ({ getFabric, selected, hasTag }) => {
    const showInit = { fill: false, colorOne: false, colorTwo: false }

    const [show, setShow] = useState(showInit);
    const [top, setTop] = useState(null);
    const [left, setLeft] = useState(null);
    const [fill, setFill] = useState('#fff');
    const [colorStopOne, setColorStopOne] = useState('#fff');
    const [colorStopTwo, setColorStopTwo] = useState('#222');
    const [tab, setTab] = useState(null);

    useEffect(() => {
        const hasGradient = selected && typeof selected.fill === 'object';
        const hasFill = selected && typeof selected.fill === 'string';
        let fillType = 'none';
        if (hasGradient) fillType = selected.fill.type;
        if (hasFill) fillType = 'fill';

        setTab(fillType);
        setFill(hasFill ? selected.fill : '#fff');
        setColorStopOne(hasGradient ? selected.fill.colorStops[0].color : '#fff');
        setColorStopTwo(hasGradient ? selected.fill.colorStops[1].color : '#222');
    }, [selected]);

    function closePopup() {
        setShow(showInit);
        setTop(null);
        setLeft(null);
    }

    function setColor(color) {
        setFill(color.hex);
        selected.set('fill', color.hex);
        getFabric().requestRenderAll();
    }

    function setColorOne(color) {
        setColorStopOne(color.hex);
        const gradient = getGradientObject(color, 'one');
        selected.setGradient('fill', gradient);
        getFabric().requestRenderAll();
    }

    function setColorTwo(color) {
        setColorStopTwo(color.hex);
        const gradient = getGradientObject(color, 'two');
        selected.setGradient('fill', gradient);
        getFabric().requestRenderAll();
    }

    function openFillPopup(event) {
        setTop(event.clientY + 20);
        setLeft(event.clientX - 80);
        setShow({ ...show, fill: true });
    }

    function openColorOnePopup(event) {
        setTop(event.clientY + 20);
        setLeft(event.clientX - 80);
        setShow({ ...show, colorOne: true });
    }

    function openColorTwoPopup(event) {
        setTop(event.clientY + 20);
        setLeft(event.clientX - 100);
        setShow({ ...show, colorTwo: true });
    }

    function selectTab(tab) {
        setTab(tab);
    }

    function getGradientObject(color, index) {
        let gradient = {
            colorStops: {
                '0': index === 'one' ? color.hex : colorStopOne,
                '1': index === 'two' ? color.hex : colorStopTwo
            }
        };

        if (tab === 'linear') {
            gradient.x1 = 0;
            gradient.y1 = 0;
            gradient.x2 = selected.width;
            gradient.y2 = 0;
        }

        if (tab === 'radial') {
            const { width, height } = selected;
            gradient.type = 'radial';
            gradient.r1 = 0;
            gradient.r2 = ((width + height) / 2) / 2;
            gradient.x1 = width / 2;
            gradient.y1 = height / 2;
            gradient.x2 = width / 2;
            gradient.y2 = height / 2;
        }

        return gradient;
    }

    const cursor = hasTag('fill') ? 'pointer' : 'default';

    return (
        <SidebarSection>
            {/* fill popup */}
            <Popup
                show={show.fill}
                top={top}
                left={left}
                close={closePopup}
            >
                <PopupContent>
                    <SketchPicker onChange={setColor} color={fill} />
                </PopupContent>
            </Popup>

            {/* gradient popup one */}
            <Popup
                show={show.colorOne}
                top={top}
                left={left}
                close={closePopup}
            >
                <PopupContent>
                    <SketchPicker onChange={setColorOne} color={colorStopOne} />
                </PopupContent>
            </Popup>

            {/* gradient popup two */}
            <Popup
                show={show.colorTwo}
                top={top}
                left={left}
                close={closePopup}
            >
                <PopupContent>
                    <SketchPicker onChange={setColorTwo} color={colorStopTwo} />
                </PopupContent>
            </Popup>

            <h4>Fill</h4>

            <div style={{ width: '100%' }}>
                <ToolbarButton
                    title="fill"
                    onClick={() => selectTab('fill')}
                    disabled={!hasTag('fill')}
                    style={{ cursor }}
                >
                    <Icon
                        path={mdiPaletteOutline}
                        size={1.2}
                        color={tab === 'fill' ? '#fafbfd' : '#595d60'}
                    />
                </ToolbarButton>

                <ToolbarButton
                    title="linear gradient"
                    onClick={() => selectTab('linear')}
                    disabled={!hasTag('fill')}
                    style={{ cursor }}
                >
                    <Icon
                        path={mdiBlurLinear}
                        size={1.2}
                        color={tab === 'linear' ? '#fafbfd' : '#595d60'}
                    />
                </ToolbarButton>

                <ToolbarButton
                    title="radial gradient"
                    onClick={() => selectTab('radial')}
                    disabled={!hasTag('fill')}
                    style={{ cursor }}
                >
                    <Icon
                        path={mdiBlurRadial}
                        size={1.2}
                        color={tab === 'radial' ? '#fafbfd' : '#595d60'}
                    />
                </ToolbarButton>
            </div>

            <div>
                {tab === 'fill'
                    ? (
                        <ToolbarButton
                            title="choose fill"
                            onClick={openFillPopup}
                            disabled={!hasTag('fill')}
                            style={{ cursor }}
                        >
                            <Icon
                                path={mdiFormatColorFill}
                                size={1.2}
                            />
                        </ToolbarButton>
                    ) : (
                        <>
                            <ToolbarButton
                                title="choose gradient color"
                                onClick={openColorOnePopup}
                                disabled={!hasTag('fill')}
                                style={{ cursor }}
                            >
                                <Icon
                                    path={mdiFormatColorFill}
                                    size={1.2}
                                />
                            </ToolbarButton>

                            <ToolbarButton
                                title="choose gradient color"
                                onClick={openColorTwoPopup}
                                disabled={!hasTag('fill')}
                                style={{ cursor }}
                            >
                                <Icon
                                    path={mdiFormatColorFill}
                                    size={1.2}
                                />
                            </ToolbarButton>
                        </>
                    )}
            </div>
        </SidebarSection>
    )
}

export default Fill;
