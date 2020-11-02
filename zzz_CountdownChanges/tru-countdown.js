import Helper from "./helper";
import { fabric } from "fabric";
import uuid from 'uuid';
import {
    intervalToDuration,
    differenceInDays,
    isBefore,
    isAfter,
    addYears,
} from 'date-fns'

fabric.TruCountdown = fabric.util.createClass(fabric.Group, {
    type: 'tru-countdown',
    itemWidth: 140,
    itemMargin: 10,
    itemFontSize: 50,
    itemTopMargin: 10,

    initialize: function (objects, options) {
        options = options || {};

        const format = {
            days: true,
            hours: true,
            minutes: true,
            seconds: true,
            daysOnly: 'no',
            direction: 'down',
            date: addYears(new Date(), 1),
        };

        this.setControlsVisibility({
            ml: false,
            mt: false,
            mr: false,
            mb: false
        });

        if (!options.uuid) this.set({ locked: false, format });

        if (!objects) {
            objects = [];
            let x = 0;

            for (const key in this.format) {
                if (this.format.hasOwnProperty(key)) {                
                    if (this.format[key] === true) {        
                        const element = this.buildElement(x, key);        
                        objects.push(element);
                        x += this.itemWidth + this.itemMargin;
                    }
                }
            }
        }
        
        this.callSuper('initialize', objects, options);
    },

    buildElement(x, key) {
        const defaults = {
            width: this.itemWidth,
            fontSize: 18,
            textAlign: 'center'
        };

        const top = this.itemFontSize + this.itemTopMargin;

        const capitalized = key.charAt(0).toUpperCase() + key.slice(1);

        const value = new fabric.TruText('', { ...defaults, fontSize: this.itemFontSize });
        const label = new fabric.TruText(capitalized, { ...defaults, top });

        const options = {
            top: 0,
            left: x,
            subType: `countdown-${key}`
        }

        return new fabric.TruGroup([value, label], options);
    },

    tick() {
        const objects = this.getObjects();

        let now = new Date();
        let target = new Date(this.format.date);

        const { direction } = this.format;
        const completed = direction === 'up' && isBefore(now, target) || direction === 'down' && isAfter(now, target);

        let interval = intervalToDuration({ start: now, end: target });

        // intervalToDuration returns days in the month, not total days since
        //  i.e. it returns 4 years, 10 months, 5 days, 16 hours, etc.
        //  so days have to be calculated separately
        const diffInDays = differenceInDays(now, target);

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const itemObjects = obj.getObjects();
            let text = '0';

            if (!completed) {
                if (obj.subType === 'countdown-days') text = Math.abs(diffInDays).toString();
                if (obj.subType === 'countdown-hours') text = interval.hours.toString();
                if (obj.subType === 'countdown-minutes') text = interval.minutes.toString();
                if (obj.subType === 'countdown-seconds') text = interval.seconds.toString();
            }

            itemObjects[0].set({ text });
        }
    },

    updateFormat(change) {
        let format = { ...this.format, ...change };

        if (change.hasOwnProperty('daysOnly')) {
            if (change.daysOnly) {
                format = {
                    ...format,
                    daysOnly: 'yes',
                    days: true,
                    hours: false,
                    minutes: false,
                    seconds: false
                }
            } else {
                format = {
                    ...format,
                    daysOnly: 'no',
                    days: true,
                    hours: true,
                    minutes: true,
                    seconds: change.seconds
                }
            }
        }

        this.set({ format });

        const rebuild = change.hasOwnProperty('seconds') || change.hasOwnProperty('daysOnly');

        if (rebuild) this.rebuild();
        else this.tick();
    },

    rebuild() {
        // left and top must be captured before rebuilding
        //   because the rebuild process changes them.
        const left = this.left;
        const top = this.top;

        const objects = this.getObjects();
        for (let i = 0; i < objects.length; i++) {
            const element = objects[i];
            this.removeWithUpdate(element);
        }

        let x = 0;
        for (const key in this.format) {
            if (this.format.hasOwnProperty(key)) {
                if (this.format[key] === true) {
                    const element = this.buildElement(x, key);
                    this.addWithUpdate(element);
                    x += this.itemWidth + this.itemMargin;
                }
            }
        }

        this.set({ left, top });
        this.setCoords();
    },

    hasTag(value) {
        return [
            this.type,
            "position"].includes(value);
    },

    toObject: function () {
        const svg = Helper.svg(this);
        const encodedSvg = btoa(svg);

        return fabric.util.object.extend(this.callSuper("toObject"), {
            uuid: this.uuid || uuid.v4(),
            svg: encodedSvg,
            format: this.format,
            locked: this.locked,
            hasControls: !this.locked,
            lockMovementX: this.locked,
            lockMovementY: this.locked,
            lockScalingX: this.locked,
            lockScalingY: this.locked,
            lockRotation: this.locked,
        });
    }
});

fabric.TruCountdown.async = true;
fabric.TruCountdown.fromObject = function (object, callback) {
    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
        fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
            const options = fabric.util.object.clone(object, true);
            options.clipPath = enlivedClipPath[0];
            delete options.objects;
            callback && callback(new fabric.TruCountdown(enlivenedObjects, options, true));
        });
    });
};
