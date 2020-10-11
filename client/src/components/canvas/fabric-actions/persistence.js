
export const deleteSelected = getFabric => {
    const objects = getFabric().getActiveObjects();
    if (!objects.length) return;

    objects.forEach(obj => {
        getFabric().remove(obj);
    });

    getFabric().discardActiveObject().requestRenderAll();
}
