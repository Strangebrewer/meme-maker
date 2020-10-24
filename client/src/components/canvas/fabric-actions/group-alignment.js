import fabric from 'fabric';

export function alignObjectsLeft(objects, limit) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const { width } = obj.getBoundingRect(true);
        let left = limit;

        if (obj.angle) {
            // convert negative angles to their positive counterpart (e.g. -44 becomes 316)
            const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

            if (a > 0 && a < 90) {
                const angle = 90 - a;
                const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                left += leg;
            }
            
            if (a >= 90 && a <= 180) left += width;

            if (a > 180 && a < 270) {
                const angle = 270 - a;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                left += leg;
            }
        }

        if (obj.stroke && !obj.angle) left += obj.strokeWidth;

        obj.set({ left });            
    }

    return objects;
}

export function alignObjectsRight(objects, limit) {        
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const { width } = obj.getBoundingRect(true);
        let left = limit - (obj.width * obj.scaleX);

        if (obj.angle) {
            const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
            const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
            left = limit;

            if (a > 0 && a < 90) {
                const angle = 90 - a;
                const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                left -= leg;
            }
            
            if (a > 180 && a < 270) {
                const angle = 270 - a;
                const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                left -= width - leg;
            }

            if (a >= 270 && a < 360) left -= width;
        }

        if (obj.stroke && !obj.angle) left -= obj.strokeWidth;

        obj.set({ left });
    }

    return objects;
}

export function alignObjectsTop(objects, ceiling) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const { height } = obj.getBoundingRect(true);
        let top = ceiling;

        if (obj.angle) {
            const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
            
            if (a >= 90 && a < 180) {
                const angle = 180 - a;
                const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                top += Math.cos(angle * Math.PI / 180) * hypotenuse;
            }

            if (a >= 180 && a <= 270) top += height;

            if (a > 270 && a < 360) {
                const angle = 360 - a;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                top += Math.sin(angle * Math.PI / 180) * hypotenuse;
            }
        }

        if (obj.stroke && !obj.angle) top += obj.strokeWidth;

        obj.set({ top });            
    }

    return objects;
}

export function alignObjectsBottom(objects, floor) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const { height } = obj.getBoundingRect(true);
        let top = floor - (obj.height * obj.scaleY) - 1;
        
        if (obj.angle) {
            const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
            top = floor;

            if (a > 0 && a <= 90) top -= height;
            
            if (a > 90 && a < 180) {
                const angle = 180 - a;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                top -= leg;
            }

            if (a > 270 && a < 360) {
                const angle = 360 - a;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                top -= height - leg;
            }
        }

        if (obj.stroke && !obj.angle) top -= obj.strokeWidth;

        obj.set({ top });
    }

    return objects;
}

export function alignObjectsHorizCenter(objects, center) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const { height } = obj.getBoundingRect(true);
        let top = center - height / 2;

        if (obj.angle) {
            const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;
            
            if (a >= 90 && a < 180) {
                const angle = 180 - a;
                const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                top += Math.cos(angle * Math.PI / 180) * hypotenuse;
            }

            if (a >= 180 && a <= 270) top += height;

            if (a > 270 && a < 360) {
                const angle = 360 - a;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                top += Math.sin(angle * Math.PI / 180) * hypotenuse;
            }
        }

        if (obj.stroke && !obj.angle) top += obj.strokeWidth;

        obj.set({ top });
    }

    return objects;
}

export function alignObjectsVertCenter(objects, center) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const { width } = obj.getBoundingRect(true);
        let left = center - width / 2;

        if (obj.angle) {
            // convert negative angles to their positive counterpart (e.g. -44 becomes 316)
            const a = obj.angle < 0 ? obj.angle + 360 : obj.angle;

            if (a > 0 && a < 90) {
                const angle = 90 - a;
                const hypotenuse = (obj.height * obj.scaleY) + obj.strokeWidth;
                const leg = Math.cos(angle * Math.PI / 180) * hypotenuse;
                left += leg;
            }
            
            if (a >= 90 && a <= 180) left += width;

            if (a > 180 && a < 270) {
                const angle = 270 - a;
                const hypotenuse = (obj.width * obj.scaleX) + obj.strokeWidth;
                const leg = Math.sin(angle * Math.PI / 180) * hypotenuse;
                left += leg;
            }
        }

        if (obj.stroke && !obj.angle) left += obj.strokeWidth;

        obj.set({ left });
    }

    return objects;
}
