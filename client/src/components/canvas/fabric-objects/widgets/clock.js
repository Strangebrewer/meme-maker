import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

fabric.Clock = fabric.util.createClass(fabric.Group, {
    type: 'clock',

    initialize: function (objects, options = {}) {
        this.setControlsVisibility({
            ml: false,
            mt: false,
            mr: false,
            mb: false
        });

        if (!options.uuid)
            this.set({ uuid: null, svg: null, locked: false });

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
        // const svg = Helper.toSvg(this);
        // const encodedSvg = btoa(svg);
        const object = fabric.util.object.extend(this.callSuper('toObject'))
        object.uuid = this.uuid || uuidv4();
        // object.svg = encodedSvg;
            
        return object;
    }
});

fabric.Clock.async = true;
fabric.Clock.fromObject = function (object, callback) {
    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
        fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
            const options = fabric.util.object.clone(object, true);
            options.clipPath = enlivedClipPath[0];
            delete options.objects;
            callback && callback(new fabric.Clock(enlivenedObjects, options, true));
        });
    });
};
