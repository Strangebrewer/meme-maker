import React, { useState } from 'react';
import Icon from '@mdi/react';
import Popup, { PopupContent, PopupButton } from '../../elements/Popup';
import {
    mdiArrowCollapseDown,
    mdiArrowCollapseUp,
    mdiArrowDown,
    mdiArrowUp,
    mdiGroup,
    mdiUngroup,
} from '@mdi/js';

import { ToolbarButton } from '../styles';

function ArrangementToolbar({ getFabric, selected }) {
    const [show, setShow] = useState(false);
    const [top, setTop] = useState(null);
    const [left, setLeft] = useState(null);
    const [content, setContent] = useState(null);

    function closePopup() {
        setShow(false);
        setTop(null);
        setLeft(null);
        setContent(null);
    } 

    function group() {
        const group = selected.toGroup();
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(group).requestRenderAll());
    }

    function ungroup() {
        const objects = selected.getObjects();
        selected.ungroupOnCanvas();
        getFabric().remove(selected);
        objects.forEach(o => getFabric().add(o));
        getFabric().setActiveObject(objects[0])
        setTimeout(() => getFabric().discardActiveObject().requestRenderAll());
    }

    function groupDisabled() {
        return !selected || selected.type !== 'activeSelection';
    }

    function ungroupDisabled() {
        return !selected || selected.type !== 'group';
    }

    function bringForward() {
        selected.bringForward(true);
        getFabric().requestRenderAll();
    }

    function sendBackward() {
        selected.sendBackwards(true);
        getFabric().requestRenderAll();
    }

    function bringToFront() {
        selected.bringToFront();
        getFabric().requestRenderAll();
        closePopup();
    }

    function sendToBack() {
        selected.sendToBack();
        getFabric().requestRenderAll();
        closePopup();
    }

    function onContextMenu(event, type) {
        event.preventDefault();
        if (!selected) return;

        let click = bringToFront;
        let path = mdiArrowDown;
        let text = 'bring to front';

        if (type === 'back') {
            click = sendToBack;
            path = mdiArrowUp;
            text = 'send to back';
        }
        
        const popup = (
            <PopupContent>
                <PopupButton onClick={click} disabled={!selected}>
                    <Icon
                        path={path}
                        size={1.2}
                    />
                    <span style={{ paddingTop: '4px', paddingLeft: '10px' }}>{text}</span>
                </PopupButton>
            </PopupContent>
        );

        setTop(event.clientY);
        setLeft(event.clientX);
        setContent(popup);
        setShow(true);
    }

    return (
        <>
            <Popup
                show={show}
                top={top}
                left={left}
                close={closePopup}
            >
                {content}
            </Popup>

            <ToolbarButton
                onClick={sendBackward}
                disabled={!selected}
                title="send backward"
                onContextMenu={e => onContextMenu(e, 'back')}
            >
                <Icon
                    path={mdiArrowCollapseUp}
                    size={1.2}
                    id="backward-icon"
                />
            </ToolbarButton>

            <ToolbarButton
                onClick={bringForward}
                disabled={!selected}
                title="bring forward"
                onContextMenu={e => onContextMenu(e)}
            >
                <Icon
                    path={mdiArrowCollapseDown}
                    size={1.2}
                />
            </ToolbarButton>

            <ToolbarButton
                onClick={group}
                disabled={groupDisabled()}
                title="group"
            >
                <Icon
                    path={mdiGroup}
                    size={1.2}
                />
            </ToolbarButton>

            <ToolbarButton
                onClick={ungroup}
                disabled={ungroupDisabled()}
                title="ungroup"
            >
                <Icon
                    path={mdiUngroup}
                    size={1.2}
                />
            </ToolbarButton>
        </>
    )
}

export default ArrangementToolbar;