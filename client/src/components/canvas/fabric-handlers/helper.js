import { fabric } from 'fabric';
import Mousetrap from 'mousetrap';
import { v4 as uuidv4 } from 'uuid';

import { deleteSelected, redo, undo } from '../fabric-actions/persistence';

let copy;

export function beforeAdding(getFabric) {
    getFabric().discardActiveObject().requestRenderAll();
    getFabric().selection = false;
    getFabric().forEachObject((o) => o.selectable = false);
    getFabric().off('mouse:down');
    getFabric().off('mouse:move');
    getFabric().off('mouse:up');
    getFabric().defaultCursor = 'crosshair';
}

export function afterAdding(getFabric) {
    getFabric().defaultCursor = 'auto';
    getFabric().off('mouse:down');
    getFabric().off('mouse:move');
    getFabric().off('mouse:up');
    getFabric().selection = true;
    getFabric().forEachObject((o) => o.selectable = true);
}

export function registerEvents(getFabric, getSelected, setSelected) {
    getFabric().on('selection:created', (e) => {
        setSelected(e);
    });

    getFabric().on('selection:updated', (e) => {
        setSelected(e);
    });

    getFabric().on('selection:cleared', (e) => {
        setSelected(e);
    });

    getFabric().on('object:modified', (e) => {
        const selected = getSelected();
        if (selected.type === 'activeSelection') return;
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
        setSelected(e);
    });

    getFabric().on('mouse:wheel', opt => {
        if (!opt.e.ctrlKey) return;
        
        const delta = opt.e.deltaY;
        let zoom = getFabric().getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        getFabric().zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        getFabric().requestRenderAll();
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });

    getFabric().on('object:moving', opt => {
        const obj = opt.target;
        const alignTolerance = 6;

        const objects = getFabric().getObjects();

        const lines = {
            top: null,
            left: null,
            right: null,
            bottom: null
        };

        const matches = {
            top: false,
            left: false,
            right: false,
            bottom: false,
        };

        const position = {
            top: parseInt(obj.get('top')),
            left: parseInt(obj.get('left')),
            right: parseInt(obj.get('left') + obj.get('width')),
            bottom: parseInt(obj.get('top') + obj.get('height'))
        };

        function inRange(pos1, pos2) {
            if ((Math.max(pos1, pos2) - Math.min(pos1, pos2)) <= alignTolerance)
                return true;
            return false;
        }

        function drawLine(side, pos) {
            let ln = null;
            switch (side) {
                case 'top':
                    ln = new fabric.Line([getFabric().get('width'), 0, 0, 0], {
                        left: 0,
                        top: pos,
                        stroke: 'rgb(178, 207, 255)'
                    });
                    lines.top = ln;
                    break;
                case 'left':
                    ln = new fabric.Line([0, getFabric().get('height'), 0, 0], {
                        left: pos,
                        top: 0,
                        stroke: 'rgb(178, 207, 255)'
                    });
                    lines.left = ln;
                    break;
                case 'right':
                    ln = new fabric.Line([0, getFabric().get('height'), 0, 0], {
                        left: pos,
                        top: 0,
                        stroke: 'rgb(178, 207, 255)'
                    });
                    lines.right = ln;
                    break;
                case 'bottom':
                    ln = new fabric.Line([getFabric().get('width'), 0, 0, 0], {
                        left: 0,
                        top: pos,
                        stroke: 'rgb(178, 207, 255)'
                    });
                    lines.bottom = ln;
                    break;
            }
            getFabric().add(ln).requestRenderAll();
        }

        for (const i in objects) {
            if (objects[i] === obj || objects[i].get('type') === 'line') continue;
            const objPosition = {
                top: parseInt(objects[i].get('top')),
                left: parseInt(objects[i].get('left')),
                right: parseInt(objects[i].get('left') + objects[i].get('width')),
                bottom: parseInt(objects[i].get('top') + objects[i].get('height')),
            }

            if (inRange(objPosition.top, position.top)) {
                if (!lines.top) {
                    drawLine('top', objPosition.top);
                    matches.top = true;
                    obj.set('top', objPosition.top).setCoords();
                }
            }

            if (inRange(objPosition.left, position.left)) {
                if (!lines.left) {
                    drawLine('left', objPosition.left);
                    matches.left = true;
                    obj.set('left', objPosition.left).setCoords();
                }
            }

            if (inRange(objPosition.right, position.right)) {
                if (!lines.right) {
                    drawLine('right', objPosition.right);
                    matches.right = true;
                    obj.set('left', objPosition.right - obj.get('width')).setCoords();
                }
            }

            if (inRange(objPosition.bottom, position.bottom)) {
                if (!lines.bottom) {
                    drawLine('bottom', objPosition.bottom);
                    matches.bottom = true;
                    obj.set('top', objPosition.bottom - obj.get('height')).setCoords();
                }
            }

            for (const key in matches) {
                const m = matches[key];
                const line = lines[key];
                if (!m) console.log('!m:::', !m);
                if (!!line) console.log('!!line:::', !!line);
                if (!m && !!line) {
                    console.log('there\'s a line and shouldn\'t be');
                    getFabric().remove(line);
                    lines[key] = null;
                    matches[key] = false;
                }
            }

            getFabric().requestRenderAll();
        }
    });

    getFabric().on('object:rotating', opt => {
        opt.target.snapAngle = 45;
        opt.target.snapThreshold = 10;
    });

    Mousetrap.bind('del', () => {
        deleteSelected(getFabric);
        setSelected({ target: null });
    });

    Mousetrap.bind('mod+z', () => undo);
    Mousetrap.bind('shift+mod+z', () => redo);
    Mousetrap.bind('esc', () => getFabric().discardActiveObject().requestRenderAll());

    Mousetrap.bind('mod+a', (e) => {
        e.preventDefault();
        getFabric().discardActiveObject();
        const objects = getFabric().getObjects();
        const selected = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selected).requestRenderAll();
    });

    Mousetrap.bind('mod+c', () => {
        const original = getSelected();

        if (original && original.type !== 'activeSelection' && original.type !== 'group') {
            original.clone((cloned) => {
                copy = cloned;
            });
        }
    });

    Mousetrap.bind('mod+v', () => {
        if (!copy) return;

        copy.clone((cloned) => {
            getFabric().discardActiveObject();
            cloned.set({
                uuid: uuidv4(),
                left: cloned.left + 10,
                top: cloned.top + 10,
                evented: true
            });
            copy.top += 10;
            copy.left += 10;
            getFabric().add(cloned);
            getFabric().setActiveObject(cloned);
            getFabric().requestRenderAll();
        });
    });
}