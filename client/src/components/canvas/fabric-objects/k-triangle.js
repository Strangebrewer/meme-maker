import { fabric } from 'fabric';
import Helper from './helper';
import { v4 as uuidv4 } from 'uuid';

fabric.KTriangle = fabric.util.createClass(fabric.Triangle, {
    type: 'k-triangle',

    initialize: function (options = {}) {
        if (!options.uuid) {
            options = Helper.setDefaultProperties({ ...options, fill: 'rgba(255,0,0,1)' });
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
        const svg = Helper.toSvg(this);
        const encodedSvg = btoa(svg);
        const object = fabric.util.object.extend(this.callSuper('toObject'), {
            uuid: this.uuid || uuidv4(),
            svg: encodedSvg
        });
        const dimensions = { width: null, height: null, top: null, left: null };
        return { ...dimensions, ...object }
    }
});

fabric.KTriangle.async = true;
fabric.KTriangle.fromObject = function(object, cb) {
    const newObject = new fabric.KTriangle(object);
    cb && cb(newObject);
};
