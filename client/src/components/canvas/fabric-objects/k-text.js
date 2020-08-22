import { fabric } from 'fabric';
import Helper from './helper';
import { v4 as uuidv4 } from 'uuid';

fabric.KText = fabric.util.createClass(fabric.Textbox, {
    type: 'k-text',

    initialize: function (text, options = {}) {
        if (!options.uuid) {
            options = Helper.setDefaultProperties({
                ...options,
                fill: '#000',
                backgroundColor: 'transparent',
                fontFamily: 'Open Sans',
                fontWeight: 400
            });
        }

        this.set('locked', false);

        this.callSuper('initialize', text, options);
    },

    hasTag(tag) {
        const tags = [
            this.type,
            'font',
            'paragraph',
            'background',
            'position',
            'shadow'
        ];

        return tags.includes(tag);
    },

    toObject: function () {
        const svg = Helper.toSvg(this);
        const encodedSvg = btoa(svg);
        return fabric.util.object.extend(this.callSuper('toObject', {
            uuid: this.uuid || uuidv4(),
            svg : encodedSvg,
        }));
    }
});

fabric.KText.async = true;
fabric.KText.fromObject = (object, callback) => {
    const text = new fabric.KText(object.text, object);
    callback && callback(text);
};
