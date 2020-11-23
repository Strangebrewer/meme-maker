"use strict";

(function(window) {
    console.log('window:::', window);

    var canvasJson = window.document.getElementById("canvas-json");
    var canvasData = JSON.parse(canvasJson.innerHTML);

    var canvas = new window.fabric.Canvas(`canvas-${canvasData._id}`, {
        preserveObjectStacking: true,
        backgroundColor: canvasData.backgroundColor
    });

    var json = JSON.stringify({
        backgroundColor: canvasData.backgroundColor,
        backgroundImage: canvasData.backgroundImage,
        objects: canvasData.objects,
        width: canvasData.width,
        height: canvasData.height
    });

    canvas.loadFromJSON(json, () => {
        canvas.requestRenderAll();
    });

    canvas.setHeight(canvasData.height);
    canvas.setWidth(canvasData.width);

})(window);