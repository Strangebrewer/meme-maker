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

import { ToolbarButton } from '../styles';

const GroupAlignment = ({ getFabric, selected, pushVersion }) => {
    function groupAlignLeft() {
        if (!selected) return;
        const limit = selected.left;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { width } = obj.getBoundingRect(true);
            let left = limit;

            if (obj.angle) {
                // convert negative angles to their positive counterpart (e.g. -44 becomes 316)
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

                if (a > 0 && a < 90) {
                    const angle = 90 - a;
                    const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                    const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                    left += leg;
                }
                
                if (a >= 90 && a <= 180) left += width;

                if (a > 180 && a < 270) {
                    const angle = 270 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    left += leg;
                }
            }

            if (obj.stroke && !obj.angle) left += obj.strokeWidth;

            obj.set({ left });            
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function groupAlignRight() {
        if (!selected) return;
        const limit = selected.left + selected.width - 1;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();
        
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { width } = obj.getBoundingRect(true);
            let left = limit - (obj.width * obj.scaleX);

            if (obj.angle) {
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                left = limit;

                if (a > 0 && a < 90) {
                    const angle = 90 - a;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    left -= leg;
                }
                
                if (a > 180 && a < 270) {
                    const angle = 270 - a;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    left -= width - leg;
                }

                if (a >= 270 && a < 360) left -= width;
            }

            if (obj.stroke && !obj.angle) left -= obj.strokeWidth;

            obj.set({ left });
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function groupAlignTop() {
        if (!selected) return;
        const ceiling = selected.top;
        const objects = selected.getObjects();

        getFabric().discardActiveObject();

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { height } = obj.getBoundingRect(true);
            let top = ceiling;

            if (obj.angle) {
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
                
                if (a >= 90 && a < 180) {
                    const angle = 180 - a;
                    const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                    top += Math.cos(angle * Math.PI / 180) * hypotenuse;
                }

                if (a >= 180 && a <= 270) top += height;

                if (a > 270 && a < 360) {
                    const angle = 360 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    top += Math.sin(angle * Math.PI / 180) * hypotenuse;
                }
            }

            if (obj.stroke && !obj.angle) top += obj.strokeWidth;

            obj.set({ top });            
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }

    function groupAlignBottom() {
        if (!selected) return;
        const floor = selected.top + selected.height - 1;
        const objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();
        
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { height } = obj.getBoundingRect(true);
            let top = floor - (obj.height * obj.scaleY);
            
            if (obj.angle) {
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
                top = floor;

                if (a > 0 && a <= 90) top -= height;
                
                if (a > 90 && a < 180) {
                    const angle = 180 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    top -= leg;
                }

                if (a > 270 && a < 360) {
                    const angle = 360 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    top -= height - leg;
                }
            }

            if (obj.stroke && !obj.angle) top -= obj.strokeWidth;

            obj.set({ top });
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();
    }
    
    function groupCenterHorizontally() {
        if (!selected) return;
        const center = selected.top + selected.height / 2;
        const objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { height } = obj.getBoundingRect(true);
            let top = center - height / 2;

            if (obj.angle) {
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
                
                if (a >= 90 && a < 180) {
                    const angle = 180 - a;
                    const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                    top += Math.cos(angle * Math.PI / 180) * hypotenuse;
                }

                if (a >= 180 && a <= 270) top += height;

                if (a > 270 && a < 360) {
                    const angle = 360 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    top += Math.sin(angle * Math.PI / 180) * hypotenuse;
                }
            }

            if (obj.stroke && !obj.angle) top += obj.strokeWidth;

            obj.set({ top });
        }

        const selection = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selection).requestRenderAll();
        pushVersion();

    }

    function groupCenterVertically() {
        if (!selected) return;
        const center = selected.left + selected.width / 2;
        const objects = selected.getObjects();

        getFabric().discardActiveObject().requestRenderAll();

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const { width } = obj.getBoundingRect(true);
            let left = center - width / 2;

            if (obj.angle) {
                // convert negative angles to their positive counterpart (e.g. -44 becomes 316)
                const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

                if (a > 0 && a < 90) {
                    const angle = 90 - a;
                    const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                    const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                    left += leg;
                }
                
                if (a >= 90 && a <= 180) left += width;

                if (a > 180 && a < 270) {
                    const angle = 270 - a;
                    const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                    const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                    left += leg;
                }
            }

            if (obj.stroke && !obj.angle) left += obj.strokeWidth;

            obj.set({ left });
        }

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
