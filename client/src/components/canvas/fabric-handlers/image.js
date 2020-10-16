import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from './helper';

export function addImage(getFabric, getScale, pushVersion, image) {
    beforeAdding(getFabric);

    fabric.KImage.fromURL(image.largeImage, async image => {
        const { height, width } = image.getBoundingRect(true);
        const scale = getScale();
        const cvWidth = getFabric().width / scale;
        const cvHeight = getFabric().height / scale;
        const top = Math.floor(cvHeight - height * scale) / 2;
        const left = Math.floor(cvWidth - width * scale) / 2;
        image.set({
            top,
            left,
            lockUniscaling: true,
            scaleX: scale,
            scaleY: scale
        });
        getFabric().add(image);
        afterAdding(getFabric);
        getFabric().setActiveObject(image).requestRenderAll();
        pushVersion();
    })
}

export function setBackgroundImageConform(getFabric, pushVersion, setDimensions, image) {
    beforeAdding(getFabric);

    fabric.KImage.fromURL(image.largeImage, image => {
        const { height, width } = image;

        setDimensions({ height, width });

        getFabric().setBackgroundImage(image, () => {
            afterAdding(getFabric);
            getFabric().requestRenderAll();
            pushVersion();
        });
    })
}

export function setBackgroundImageStretch(getFabric, getScale, pushVersion, image) {
    console.log('setBackgroundImageStretch is happening');
    beforeAdding(getFabric);

    fabric.KImage.fromURL(image.largeImage, image => {
        const { height, width } = image;
        const cvWidth = getFabric().width / getScale();
        const cvHeight = getFabric().height / getScale();

        // default is to scale by width:
        let scale = cvWidth / width;
        let left = 0;
        let top = (cvHeight - (height * scale)) / 2;
        
        if (cvWidth / width > cvHeight / height) {
            // If the difference between the width and the canvas width 
            //  is greater than the difference between height and canvas height,
            //  scale by height
            scale = cvHeight / height;
            left = (cvWidth - (width * scale)) / 2;
            top = 0;
        }

        const options = {
            left,
            top,
            scaleX: scale,
            scaleY: scale
        };

        getFabric().setBackgroundImage(image, () => {
            afterAdding(getFabric);
            getFabric().requestRenderAll();
            pushVersion();
        }, options)
    })
}

export function setBackgroundImageFill(getFabric, getScale, pushVersion, image) {
    console.log('setBackgroundImageFill is happening');
    beforeAdding(getFabric);

    fabric.KImage.fromURL(image.largeImage, image => {
        const { height, width } = image;
        const cvWidth = getFabric().width / getScale();
        const cvHeight = getFabric().height / getScale();

        // default is to scale by width:
        let scale = cvWidth / width;
        let left = 0;
        let top = (cvHeight - (height * scale)) / 2;
        
        if (cvWidth / width > cvHeight / height) {
            // If the difference between the width and the canvas width 
            //  is greater than the difference between height and canvas height,
            //  scale by height
            scale = cvHeight / height;
            left = (cvWidth - (width * scale)) / 2;
            top = 0;
        }

        const options = {
            left,
            top,
            scaleX: scale,
            scaleY: scale
        };

        getFabric().setBackgroundImage(image, () => {
            afterAdding(getFabric);
            getFabric().requestRenderAll();
            pushVersion();
        }, options)
    })
}

export function setBackgroundImageFit(getFabric, getScale, pushVersion, image) {
    beforeAdding(getFabric);

    fabric.KImage.fromURL(image.largeImage, image => {
        const { height, width } = image;
        const cvWidth = getFabric().width / getScale();
        const cvHeight = getFabric().height / getScale();

        // default is to scale by width:
        let scale = cvWidth / width;
        let left = 0;
        let top = (cvHeight - (height * scale)) / 2;
        
        if (cvWidth / width > cvHeight / height) {
            // If the difference between the width and the canvas width 
            //  is greater than the difference between height and canvas height,
            //  scale by height
            scale = cvHeight / height;
            left = (cvWidth - (width * scale)) / 2;
            top = 0;
        }

        const options = {
            left,
            top,
            scaleX: scale,
            scaleY: scale
        };

        getFabric().setBackgroundImage(image, () => {
            afterAdding(getFabric);
            getFabric().requestRenderAll();
            pushVersion();
        }, options)
    });
}