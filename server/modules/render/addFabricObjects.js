"use strict";

(function(window) {
    var fabric = window.fabric;
    fabric.KCircle = fabric.util.createClass(fabric.Circle,{ type: 'k-circle' });
    fabric.KCircle.async = true;
    fabric.KCircle.fromObject = function(object, cb) {
        const newObject = new fabric.KCircle(object);
        cb && cb(newObject);
    };

    fabric.KGroup = fabric.util.createClass(fabric.Group, { type: 'k-group' });
    fabric.KGroup.async = true;
    fabric.KGroup.fromObject = function (object, callback) {
        fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
            fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
                const options = fabric.util.object.clone(object, true);
                options.clipPath = enlivedClipPath[0];
                delete options.objects;
                callback && callback(new fabric.KGroup(enlivenedObjects, options, true));
            });
        });
    };

    fabric.KImage = fabric.util.createClass(fabric.Image, { type: 'k-image' });
    fabric.KImage.async = true;
    fabric.KImage.fromURL = (url, callback) => {
        const options = { crossOrigin: 'anonymous' };

        fabric.util.loadImage(url, function(img) {
            callback && callback(new fabric.KImage(img, options));
        }, null, options && options.crossOrigin);
    };
    fabric.KImage.fromObject = function (object, callback) {
        const options = { crossOrigin: 'anonymous' };

        fabric.util.loadImage(object.src, function(img) {
            callback && callback(new fabric.KImage(img, object));
        }, null, options.crossOrigin);
    };

    fabric.KPath = fabric.util.createClass(fabric.Path, { type: 'k-path' });
    fabric.KPath.async = true;
    fabric.KPath.fromObject = function (object, callback) {
        const { path } = object;
        delete object.path;
        const newObject = new fabric.KPath(path, object);
        callback && callback(newObject);
    };

    fabric.KRect = fabric.util.createClass(fabric.Rect, { type: 'k-rect' });
    fabric.KRect.async = true;
    fabric.KRect.fromObject = function(object, cb) {
        const newObject = new fabric.KRect(object);
        cb && cb(newObject);
    };

    fabric.KSvg = fabric.util.createClass(fabric.Group, { type: 'k-svg' });
    fabric.KSvg.async = true;
    fabric.KSvg.fromObject = function (object, callback) {
        fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
            fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
                const options = fabric.util.object.clone(object, true);
                options.clipPath = enlivedClipPath[0];
                delete options.objects;
                callback && callback(new fabric.KSvg(enlivenedObjects, options, true));
            });
        });
    };

    fabric.KText = fabric.util.createClass(fabric.Textbox, { type: 'k-text' });
    fabric.KText.async = true;
    fabric.KText.fromObject = (object, callback) => {
        const text = new fabric.KText(object.text, object);
        callback && callback(text);
    };
    
    fabric.KTriangle = fabric.util.createClass(fabric.Triangle, { type: 'k-triangle' });
    fabric.KTriangle.async = true;
    fabric.KTriangle.fromObject = function(object, cb) {
        const newObject = new fabric.KTriangle(object);
        cb && cb(newObject);
    };
    
    fabric.KVideo = fabric.util.createClass(fabric.Image, { type: 'k-video' });
    fabric.KVideo.async = true;
    fabric.KVideo.fromURL = (url, callback) => {
        const options = { crossOrigin: 'anonymous' };
    
        fabric.util.loadImage(url, function(img) {
            callback && callback(new fabric.KVideo(img, options));
        }, null, options && options.crossOrigin);
    };    
    fabric.KVideo.fromObject = (object, callback) => {
        const options = { crossOrigin: 'anonymous' };
    
        fabric.util.loadImage(object.src, function(img) {
            callback && callback(new fabric.KVideo(img, object));
        }, null, options.crossOrigin);
    };
})(window);