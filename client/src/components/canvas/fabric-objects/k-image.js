import Helper from './helper';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

fabric.KImage = fabric.util.createClass(fabric.Image, {
    type: 'k-image',

    initialize: function (element, options = {}) {

        if (!options.uuid)
            this.set({ uuid: null, svg: null, locked: false });

        this.set({locked: false, lockUniScaling: true });
        this.callSuper('initialize', element, options);
    },

    hasTag(tag) {
        const tags = [
            this.type,
            'cover',
            'fixedSize',
            'position'
        ]
        return tags.includes(tag);
    },

    toObject: function() {
        // const svg = Helper.toSvg(this);
        // const encodedSvg = btoa(svg);
        const object = fabric.util.object.extend(this.callSuper('toObject'))
        object.uuid = this.uuid || uuidv4();
        // object.svg = encodedSvg;
        
        return object;
    }
});

fabric.KImage.async = true;

fabric.KImage.fromURL = (url, callback) => {
    const options = { crossOrigin: 'anonymous' };

    fabric.util.loadImage(url, function(img) {
        callback && callback(new fabric.KImage(img, options));
    }, null, options && options.crossOrigin);
}

fabric.KImage.fromObject = function (object, callback) {
    const options = { crossOrigin: 'anonymous' };

    fabric.util.loadImage(object.src, function(img) {
        callback && callback(new fabric.KImage(img, object));
    }, null, options.crossOrigin);
};
