import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from './helper';

export function group(getFabric, selected, pushVersion) {
    beforeAdding(getFabric);

    const objects = selected.getObjects();
    const newGroup = new fabric.KGroup(objects);
    objects.forEach(obj => obj.canvas.remove(obj));

    getFabric().add(newGroup).requestRenderAll();
    afterAdding(getFabric);
    pushVersion();
}

export function ungroup(getFabric, selected, pushVersion) {
    if (!selected || selected.type !== 'k-group') return;
    const ungrouped = selected.ungroupOnCanvas();
    const objects = ungrouped.getObjects();
    objects.forEach(obj => obj.canvas.add(obj));

    getFabric().remove(selected).requestRenderAll();
    afterAdding(getFabric);
    pushVersion();
}