import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from './helper';

export function addCircle(getFabric) {
    beforeAdding(getFabric);

    let isMouseDown = false;
    let object = null;

    getFabric().on('mouse:down', () => {
        isMouseDown = true;
        const pointer = getFabric().getPointer();

        object = new fabric.KCircle({
            radius: 0,
            top: pointer.y,
            left: pointer.x,
        });

        getFabric().add(object).requestRenderAll();
    });

    getFabric().on('mouse:move', () => {
        if (!isMouseDown) return;
        const pointer = getFabric().getPointer();

        const x = object.left - pointer.x;
        const y = object.top - pointer.y;
        const diff = Math.sqrt(x * x + y * y);

        // bottom-right quadrant
        if (object.left < pointer.x && object.top < pointer.y) {
            object.set({ angle: 0, radius: diff / 2.3 });
        }

        // bottom-left quadrant
        if (object.left > pointer.x && object.top < pointer.y) {
            object.set({ angle: 90, radius: diff / 2.3 });
        }

        // top-left quadrant
        if (object.left > pointer.x && object.top > pointer.y) {
            object.set({ angle: 180, radius: diff / 2.3 });
        }

        // top-right quadrant
        if (object.left < pointer.x && object.top > pointer.y) {
            object.set({ angle: 270, radius: diff / 2.3 });
        }

        getFabric().requestRenderAll();
    });

    getFabric().on('mouse:up', () => {
        isMouseDown = false;

        object.set({ radius: Math.floor(object.radius) });
        let isEmpty = object.radius === 0;

        if (isEmpty) {
            getFabric().remove(object).requestRenderAll();
        }

        afterAdding(getFabric);

        object.setCoords();
        getFabric().setActiveObject(object).requestRenderAll();
    });
}

export function addRect(getFabric) {
    beforeAdding(getFabric);

    let isMouseDown = false;
    let object = null;

    getFabric().on('mouse:down', () => {
        isMouseDown = true;
        const pointer = getFabric().getPointer();

        object = new fabric.KRect({
            top: pointer.y,
            left: pointer.x,
            width: 0,
            height: 0
        });

        getFabric().add(object).requestRenderAll();
    });

    getFabric().on('mouse:move', () => {
        if (!isMouseDown) return;
        const pointer = getFabric().getPointer();

        const width = (object.left - pointer.x) * -1;
        const height = (object.top - pointer.y) * -1;

        object.set({ width, height });

        getFabric().requestRenderAll();
    });

    getFabric().on('mouse:up', () => {
        isMouseDown = false;

        const isEmpty = (!object.height && !object.width);

        if (isEmpty) {
            getFabric().remove(object).requestRenderAll();
            return afterAdding(getFabric);
        }

        const { width, height, top, left } = object;
        object.set({ width: Math.floor(width), height: Math.floor(height) });

        if (width < 0) {
            const newLeft = left + width;
            const newWidth = Math.abs(width);
            object.set({ left: newLeft, width: newWidth });
            getFabric().requestRenderAll();
        }

        if (height < 0) {
            const newTop = top + height;
            const newHeight = Math.abs(height);
            object.set({ top: newTop, height: newHeight });
        }

        afterAdding(getFabric);

        object.setCoords();
        getFabric().setActiveObject(object).requestRenderAll();
    });
}

export function addTriangle(getFabric) {
    beforeAdding(getFabric);

    let isMouseDown = false;
    let object = null;

    getFabric().on('mouse:down', () => {
        isMouseDown = true;
        const pointer = getFabric().getPointer();

        object = new fabric.KTriangle({
            top: pointer.y,
            left: pointer.x,
            width: 1,
            height: 1,
        })

        getFabric().add(object).requestRenderAll();
    });

    getFabric().on('mouse:move', () => {
        if (!isMouseDown) return;
        const pointer = getFabric().getPointer();

        const newWidth = (object.left - pointer.x) * -1;
        const newHeight = (object.top - pointer.y) * -1;
        object.set({ width: newWidth, height: newHeight });

        getFabric().requestRenderAll();
    });

    getFabric().on('mouse:up', () => {
        isMouseDown = false;
        let isEmpty = (object.height === 1 && object.width === 1);

        if (isEmpty) {
            getFabric().remove(object)
            return afterAdding(getFabric);
        }

        const { width, height } = object;
        object.set({ width: Math.floor(width), height: Math.floor(height) });

        afterAdding(getFabric);

        object.setCoords();
        getFabric().setActiveObject(object).requestRenderAll();
    });
}