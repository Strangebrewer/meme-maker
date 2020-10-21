import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from './helper';

export function addSvg(svg, getFabric, pushVersion) {
    if (typeof svg !== 'string') return;
    beforeAdding(getFabric);

    let isMouseDown = false;
    let object = null;

    getFabric().on('mouse:down', ({ e }) => {
        isMouseDown = true;
        const pointer = getFabric().getPointer(e);

        const defaults = {
            top: pointer.y,
            left: pointer.x,
            scaleX: 0,
            scaleY: 0
        };

        fabric.loadSVGFromString(svg, (results, options) => {
            if (results.length > 1) {
                object = new fabric.KSvg(results, defaults);
            } else {
                object = new fabric.KPath(results[0].path, defaults);
            }
        });

        getFabric().add(object).requestRenderAll();
    });

    getFabric().on('mouse:move', ({ e }) => {
        if (!isMouseDown) return;

        const pointer = getFabric().getPointer();

        const x = object.left - pointer.x;
        const y = object.top - pointer.y;
        const h = object.height;
        const w = object.width;
        let scale = Math.sqrt(x * x + y * y) / 2;

        // allow it to scale faster if the object dimensions differ significantly:
        if (w > h * 2 || h > w * 2)
            scale = Math.sqrt(x * x + y * y) / 1.3;

        if (w > h)
            object.scaleToWidth(scale)
        else
            object.scaleToHeight(scale)

        // bottom-right quadrant
        if (object.left < pointer.x && object.top < pointer.y) {
            object.set({ flipX: false, flipY: false, originX: 'left', originY: 'top' });
        }

        // bottom-left quadrant
        if (object.left > pointer.x && object.top < pointer.y) {
            object.set({ flipX: true, flipY: false, originX: 'right', originY: 'top' });
        }

        // top-left quadrant
        if (object.left > pointer.x && object.top > pointer.y) {
            object.set({ flipX: true, flipY: true, originX: 'right', originY: 'bottom' });
        }

        // top-right quadrant
        if (object.left < pointer.x && object.top > pointer.y) {
            object.set({ flipX: false, flipY: true, originX: 'left', originY: 'bottom' });
        }

        getFabric().requestRenderAll();
    });

    getFabric().on('mouse:up', () => {
        isMouseDown = false;

        const { width, height } = object;
        object.set({ width: Math.floor(width), height: Math.floor(height) });

        let isEmpty = (!object.scaleX && !object.scaleY);

        if (isEmpty) {
            getFabric().remove(object);
        }
        
        afterAdding(getFabric);
    });
}