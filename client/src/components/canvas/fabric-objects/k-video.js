import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

fabric.KVideo = fabric.util.createClass(fabric.Image, {
    type: 'k-video',

    initialize: function (element, options = {}) {

        this.setControlsVisibility({
            mt : false,
            mb : false,
            ml : false,
            mr : false,
        });

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
        const object = fabric.util.object.extend(this.callSuper('toObject', {
            uuid: this.uuid || uuidv4(),
            video_url: this.video_url,
            poster : this.poster,
            autoplay : this.autoplay,
            loop : this.loop,
            muted : this.muted,
        }));
        return object;
    }
});

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
