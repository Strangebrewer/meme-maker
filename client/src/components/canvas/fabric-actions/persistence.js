
export const deleteSelected = getFabric => {
    const objects = getFabric().getActiveObjects();
    if (!objects.length) return;

    objects.forEach(obj => {
        getFabric().remove(obj);
    });

    getFabric().discardActiveObject().requestRenderAll();
}

export function generateThumbnail(canvas) {
    const base64 = canvas.toDataURL('png');
    canvas.requestRenderAll();
    const max = 256;
    let scale = max / canvas.width;
    if (canvas.width < canvas.height) {
        scale = max / canvas.height;
    }
    const size = {
        width: canvas.width * scale,
        height: canvas.height * scale
    }

    return new Promise(function(resolve) {
        const img = document.createElement('img');

        img.onload = function() {
            const newCanvas = document.createElement('canvas');
            Object.assign(newCanvas, size);

            newCanvas.getContext('2d').drawImage(this, 0, 0, size.width, size.height);
            const base64Thumb = newCanvas.toDataURL('png');

            resolve(base64Thumb);
        }

        img.src = base64;
    });
}