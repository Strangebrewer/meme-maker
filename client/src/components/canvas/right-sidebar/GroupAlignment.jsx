import React from 'react';
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

import {
    alignObjectsLeft,
    alignObjectsRight,
    alignObjectsTop,
    alignObjectsBottom,
    alignObjectsHorizCenter,
    alignObjectsVertCenter
} from '../fabric-actions/group-alignment';
import { ToolbarButton } from '../styles';

const GroupAlignment = ({ getFabric, selected, pushVersion }) => {
    function groupAlignLeft() {
        if (!selected) return;
        const limit = selected.left;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();
        
        const returnedObjects = alignObjectsLeft(objects, limit);

        const selection = new fabric.ActiveSelection(returnedObjects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function groupAlignRight() {
        if (!selected) return;
        const limit = selected.left + selected.width - 1;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();
        
        const returnedObjects = alignObjectsRight(objects, limit);

        const selection = new fabric.ActiveSelection(returnedObjects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function groupAlignTop() {
        if (!selected) return;
        const ceiling = selected.top;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();

        const returnedObjects = alignObjectsTop(objects, ceiling);

        const selection = new fabric.ActiveSelection(returnedObjects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function groupAlignBottom() {
        if (!selected) return;
        const floor = selected.top + selected.height - 1;
        const objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();
        
        const returnedObjects = alignObjectsBottom(objects, floor);

        const selection = new fabric.ActiveSelection(returnedObjects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }
    
    function groupCenterHorizontally() {
        if (!selected) return;
        const center = selected.top + selected.height / 2;
        let objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();

        objects = alignObjectsHorizCenter(objects, center);

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();

    }

    function groupCenterVertically() {
        if (!selected) return;
        const center = selected.left + selected.width / 2;
        let objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();
        
        objects = alignObjectsVertCenter(objects, center);

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
        
    }

    function distributeHorizontally() {
        if (!selected) return;
        if (selected.type !== 'activeSelection') return;

        const objects = selected.getObjects();
        const { width } = selected.getBoundingRect(true);

        getFabric().discardActiveObject().requestRenderAll();

        objects.sort((a, b) => {
            const aRect = a.getBoundingRect(true);
            const bRect = b.getBoundingRect(true);
            return aRect.left > bRect.left ? 1 : -1;
        });
        let leftmostObject = objects[0];

        const objectRightsides = objects.map(o => {
            const { left, width } = o.getBoundingRect(true);
            return left + width;
        });
        const max = Math.max(...objectRightsides);
        const index = objectRightsides.indexOf(max);
        let rightmostObject = objects[index];

        if (leftmostObject.uuid === rightmostObject.uuid) {
            leftmostObject = objects.shift();

            const combinedWidth = objects.reduce((total, obj) => {
                const { width } = obj.getBoundingRect(true);
                return total + width;
            }, 0);
            let spaceBetween = (width - combinedWidth) / (objects.length - 1);

            let left = selected.left;

            if (combinedWidth < width) {
                spaceBetween = (width - combinedWidth) / (objects.length + 1);
                left += spaceBetween;
            }

            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i];
                const br = obj.getBoundingRect(true);
                let modifier = 0;

                if (obj.angle) {
                    const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

                    if (a > 0 && a < 90) {
                        const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                        const leg = Math.sin(a * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }

                    if (a >= 90 && a <= 180) modifier += br.width;

                    if (a > 180 && a < 270) {
                        const angle = 270 - a;
                        const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                        const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }
                }
                
                if (combinedWidth > width) {
                    if (i === 0) left += 1;
                    if (i === objects.length - 1) left -= 1;
                }

                obj.set({ left: left + modifier });
                left += br.width + spaceBetween;
            }

            objects.unshift(leftmostObject);

        } else {
            const combinedWidth = objects.reduce((total, obj) => {
                const { width } = obj.getBoundingRect(true);
                return total + width;
            }, 0);
            let spaceBetween = (width - combinedWidth) / (objects.length - 1);
            rightmostObject = objects.splice(index, 1);
            objects.push(rightmostObject[0]);

            let left = selected.left;
            for (let i = 0; i < objects.length - 1; i++) {
                const obj = objects[i];
                const br = obj.getBoundingRect(true);
                let modifier = 0;

                if (obj.angle) {
                    const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

                    if (a > 0 && a < 90) {
                        const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                        const leg = Math.sin(a * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }

                    if (a >= 90 && a <= 180) modifier += br.width;

                    if (a > 180 && a < 270) {
                        const angle = 270 - a;
                        const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                        const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }
                }

                obj.set({ left: left + modifier });
                left += br.width + spaceBetween;
            }
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function distributeVertically() {
        if (!selected) return;
        if (selected.type !== 'activeSelection') return;

        const objects = selected.getObjects();
        const { height } = selected.getBoundingRect(true);

        getFabric().discardActiveObject().requestRenderAll();
        objects.sort((a, b) => {
            const aRect = a.getBoundingRect(true);
            const bRect = b.getBoundingRect(true);
            return aRect.top > bRect.top ? 1 : -1;
        });
        let topObject = objects[0];
        
        const objectBottoms = objects.map(o => {
            const { top, height } = o.getBoundingRect(true);
            return top + height;
        });
        const max = Math.max(...objectBottoms);
        const index = objectBottoms.indexOf(max);
        let bottomObject = objects[index];
        
        if (topObject.uuid === bottomObject.uuid) {
            topObject = objects.shift();

            const combinedHeight = objects. reduce((total, obj) => {
                const { height } = obj.getBoundingRect(true);
                return total + height;
            }, 0);
            let spaceBetween = (height - combinedHeight) / (objects.length - 1);

            let top = selected.top;

            if (combinedHeight < height) {
                spaceBetween = (height - combinedHeight) / (objects.length + 1);
                top += spaceBetween;
            }

            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i];
                const br = obj.getBoundingRect(true);
                let modifier = 0;

                if (obj.angle) {
                    const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

                    if (a > 90 && a < 180) {
                        const angle = 180 - a;
                        const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                        const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }

                    if (a >= 180 && a <= 270) modifier += br.height;

                    if (a > 270 && a < 360) {
                        const angle = 360 - a;
                        const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                        const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }
                }
                
                if (combinedHeight > height) {
                    if (i === 0) top += 1;
                    if (i === objects.length - 1) top -= 1;
                }

                obj.set({ top: top + modifier });
                top += br.height + spaceBetween;
            }

            objects.unshift(topObject);

        } else {
            const combinedHeight = objects. reduce((total, obj) => {
                const { height } = obj.getBoundingRect(true);
                return total + height;
            }, 0);
            const spaceBetween = (height - combinedHeight) / (objects.length - 1);

            bottomObject = objects.splice(index, 1);
            objects.push(bottomObject[0]);

            let top = selected.top;

            for (let i = 0; i < objects.length - 1; i++) {
                const obj = objects[i];
                const br = obj.getBoundingRect(true);
                let modifier = 0;

                if (obj.angle) {
                    const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

                    if (a > 90 && a < 180) {
                        const angle = 180 - a;
                        const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                        const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }

                    if (a >= 180 && a <= 270) modifier += br.height;

                    if (a > 270 && a < 360) {
                        const angle = 360 - a;
                        const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                        const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                        modifier += leg;
                    }
                }

                obj.set({ top: top + modifier });
                top += br.height + spaceBetween;
            }
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    const isGroup = selected && selected.type === 'activeSelection';
    const isDistributable = selected && selected.type === 'activeSelection' && selected._objects.length > 2;
    const cursor = isGroup ? 'pointer' : 'default';
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

            <ToolbarButton title="center horizontally" onClick={groupCenterVertically} disabled={!isGroup} style={{ cursor }}>
                <Icon path={mdiAlignHorizontalCenter} size={1.1} />
            </ToolbarButton>

            <ToolbarButton title="center vertically" onClick={groupCenterHorizontally} disabled={!isGroup} style={{ cursor }}>
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
