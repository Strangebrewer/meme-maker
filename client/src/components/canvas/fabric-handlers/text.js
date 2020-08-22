import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from './helper';

export function addText(getFabric) {
    beforeAdding(getFabric);
    let isMouseDown = false;
    let object = null

    getFabric().on('mouse:down', ({ e }) => {
        isMouseDown = true;
        const pointer = getFabric().getPointer(e);

        object = new fabric.KText('', {
            top: pointer.y,
            left: pointer.x,
            width: 200
        });

        object.on('editing:exited', () => {
            if (!object.text.length) {
                getFabric().remove(object).requestRenderAll();
            } else {
                object.off('editing:exited');
            }
            afterAdding(getFabric);
        });

        getFabric().add(object);
        getFabric().defaultCursor = 'auto';
        
        getFabric().setActiveObject(object).requestRenderAll();
        object.enterEditing();
    });
}
