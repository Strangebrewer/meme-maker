import { fabric } from 'fabric';
import Helper from './helper';
import { v4 as uuidv4 } from 'uuid';

fabric.KCircle = fabric.util.createClass(fabric.Circle, {
    type: 'k-circle',

    initialize: function (options = {}) {
        if (!options.uuid) {
            options = Helper.setDefaultProperties({ ...options, fill: 'rgba(0,255,0,1)' });
            this.set(options);
        }

        this.callSuper('initialize', options);
    },

    hasTag(tag) {
        const tags = [
            this.type,
            'border',
            'fill',
            'position',
            'shadow',
            'shape',
            'size',
        ];
        return tags.includes(tag);
    },

    toObject: function () {
        // const svg = Helper.toSvg(this);
        // const encodedSvg = btoa(svg);
        const object = fabric.util.object.extend(this.callSuper('toObject'));
        object.uuid = this.uuid || uuidv4();
        // object.svg = encodedSvg;
            
        const dimensions = { width: null, height: null, top: null, left: null };
        return { ...dimensions, ...object }
    }
});

fabric.KCircle.async = true;
fabric.KCircle.fromObject = function(object, cb) {
    const newObject = new fabric.KCircle(object);
    cb && cb(newObject);
};
