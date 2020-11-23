import Helper from './helper';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

fabric.KPath = fabric.util.createClass(fabric.Path, {
    type: 'k-path',

    initialize: function (path, options = {}) {

        if (!options.uuid)
            this.set({ uuid: null, svg: null, locked: false });

        this.callSuper('initialize', path, options);
    },

    hasTag(tag) {
        const tags = [
            this.type,
            'fill',
            'path',
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
        object.path = this.path.map(item => item.slice());

        return object;
    }
});

fabric.KPath.async = true;
fabric.KPath.fromObject = function (object, callback) {
    const { path } = object;
    delete object.path;
    const newObject = new fabric.KPath(path, object);
    callback && callback(newObject);
};
