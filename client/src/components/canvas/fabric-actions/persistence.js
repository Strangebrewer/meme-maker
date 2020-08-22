
export const deleteSelected = getFabric => {
    const objects = getFabric().getActiveObjects();
    if (!objects.length) return;

    objects.forEach(obj => {
        getFabric().remove(obj);
    });

    getFabric().discardActiveObject().requestRenderAll();
}

export const undo = getFabric => {
    // after setting up a versioning system
}

export const redo = getFabric => {
    // after setting up a versioning system
}