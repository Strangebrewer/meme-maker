import Helper from './helper';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

fabric.KSvg = fabric.util.createClass(fabric.Group, {
    type: 'k-svg',

    initialize: function (objects, options = {}) {
        this.setControlsVisibility({
            ml: false,
            mt: false,
            mr: false,
            mb: false
        });

        if (!options.uuid)
            this.set({ uuid: null, svg: null });

        this.callSuper('initialize', objects, options);
    },

    hasTag(tag) {
        const tags = [
            this.type,
            'position',
        ];
        return tags.includes(tag);
    },

    toObject: function() {
        const svg = Helper.toSvg(this);
        const encodedSvg = btoa(svg);
        console.log('encodedSvg in k-svg:::', encodedSvg)
        const object = fabric.util.object.extend(this.callSuper('toObject'))
        object.uuid = this.uuid || uuidv4();
        object.svg = encodedSvg;;

        return object;
    }
});

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
