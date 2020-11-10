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
        
        if (!options.uuid)
            this.set({ uuid: null, locked: false });

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
        const object = fabric.util.object.extend(this.callSuper('toObject'));
        object.uuid = this.uuid || uuidv4();
        object.video_url = this.video_url;
        object.poster = this.poster;
        object.autoplay = this.autoplay;
        object.loop = this.loop;
        object.muted = this.muted;
        
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
