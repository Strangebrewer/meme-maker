import Helper from "../helper";
import { fabric } from "fabric";
import uuid from 'uuid';
import { isToday } from 'date-fns';
import api from '@/api';

fabric.TruWeather = fabric.util.createClass(fabric.Group, {
    type: 'tru-weather',

    initialize: function (objects, options) {
        if (!options) options = {};

        this.setControlsVisibility({
            ml: false,
            mt: false,
            mr: false,
            mb: false
        });

        if (!options.uuid) {
            const config = { ...options.config };

            this.set({
                locked: false,
                uuid: uuid.v4(),
                svg: null,
                config
            });
        }

        this.callSuper('initialize', objects, options);
        this.updateZipcode(this.config.zipcode);
    },

    async updateZipcode(zipcode) {
        const isCurrent = zipcode === this.config.zipcode
            && (isToday(new Date (this.config.created)));

        if (isCurrent) return;

        let objects = this.getObjects();

        const { data } = await api.integration.weather({ zipcode, metric: this.config.metric });
        
        const { city, state, forecast } = data.dailyForecasts.forecastLocation;
        const locationText = `${city}, ${state}`;
        const deg = this.config.metric ? 'C' : 'F';

        const config = {
            ...this.config,
            zipcode,
            location: `${city}, ${state}`,
            created: new Date()
        };
        this.set({ config });

        if (this.config.showLocation)
            objects[2].set({ text: locationText });

        // filter for day objects
        const dayObjects = objects.filter(obj => obj.subType === 'weather-day');

        for (let i = 0; i < dayObjects.length; i++) {
            const obj = dayObjects[i];
            const subObjects = obj.getObjects();
            const fc = forecast[i];

            // replace weather icon
            const img = new Image();
            img.src = fc.iconLink;
            img.onload = function () {
                subObjects[0].setElement(img, { crossOrigin: 'anonymous' });
                subObjects[0].set({ width: 100, height: 100 });
                subObjects[0].canvas.requestRenderAll();
            }

            // replace high text
            const hi = parseFloat(fc.highTemperature).toFixed(0);
            const hiText = `H:  ${hi}\u00B0${deg}`;
            subObjects[1].set({ text: hiText });

            // replace low text
            const lo = parseFloat(fc.lowTemperature).toFixed(0);
            const loText = `L:  ${lo}\u00B0${deg}`;
            subObjects[2].set({ text: loText });
            
            // replace day text
            const dayText = fc.weekday.substr(0, 3);
            subObjects[3].set({ text: dayText });
        }

        this.canvas.requestRenderAll();
    },

    async toggleMetric(bool) {
        if (bool === this.config.metric) return;

        const request = {
            zipcode: this.config.zipcode,
            metric: bool
        };

        const { data } = await api.integration.weather(request);
        const { forecast } = data.dailyForecasts.forecastLocation;

        const config = {
            ...this.config,
            metric: bool
        };
        this.set({ config });

        const deg = bool ? 'C' : 'F';

        // filter for day objects
        const dayObjects = this.getObjects().filter(obj => obj.subType === 'weather-day');

        for (let i = 0; i < dayObjects.length; i++) {
            const obj = dayObjects[i];
            const subObjects = obj.getObjects();
            const fc = forecast[i];

            // replace high text
            const hiText = `H:  ${parseFloat(fc.highTemperature).toFixed(0)}\u00B0${deg}`;
            subObjects[1].set({ text: hiText });

            // replace low text
            const loText = `L:  ${parseFloat(fc.lowTemperature).toFixed(0)}\u00B0${deg}`;
            subObjects[2].set({ text: loText });
        }

        this.canvas.requestRenderAll();
    },

    toggleLocation(bool) {
        if (bool === this.config.showLocation) return;

        let objects = this.getObjects();

        const config = {
            ...this.config,
            showLocation: bool
        };

        this.set({ config });

        if (bool)
            objects[2].set({ text: this.config.location });
        else
            objects[2].set({ text: '' });

        this.canvas.requestRenderAll();
    },

    hasTag(value) {
        return [
            this.type,
            'position'
        ].includes(value);
    },

    // once all this is working, change the below to
    // "toObject() {" to see if it makes any difference. It shouldnt'.
    toObject: function () {
        const svg = Helper.svg(this);
        const encodedSvg = btoa(svg);

        return fabric.util.object.extend(this.callSuper('toObject'), {
            uuid: this.uuid || uuid.v4(),
            svg: encodedSvg,
            config: this.config,
            locked: this.locked,
            hasControls: !this.locked,
            lockMovementX: this.locked,
            lockMovementY: this.locked,
            lockScalingX: this.locked,
            lockScalingY: this.locked,
            lockRotation: this.locked,
        })
    }
});

fabric.TruWeather.async = true;
fabric.TruWeather.fromObject = function (object, callback) {
    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
        fabric.util.enlivenObjects([object.clipPath], function (enlivenedClipPath) {
            const options = fabric.util.object.clone(object, true);
            options.clipPath = enlivenedClipPath[0];
            delete options.objects;
            callback && callback(new fabric.TruWeather(enlivenedObjects, options, true ));
        });
    });
}