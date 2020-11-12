import { fabric } from 'fabric';
import api from '@/api';

export default {
    methods: {
        addStockWidget() {
            this.beforeAdding();
            let isMouseDown = false;
            let object      = null;
            this.getFabric().on('mouse:down', ({ e }) => {
                isMouseDown   = true;
                const pointer = this.getFabric().getPointer(e);

                object = new fabric.TruStock('', {
                    top  : pointer.y,
                    left : pointer.x
                });

                object.on('editing:exited', () => {
                    if (!object.text.length) {
                        this.getFabric().remove(object).requestRenderAll();
                    } else {
                        object.off('editing:exited');
                    }
                });

                this.getFabric().add(object);

                this.getFabric().defaultCursor = 'auto';
                this.getFabric().off('mouse:down');
                this.afterAdding(object);

                this.getFabric().setActiveObject(object).requestRenderAll();
            });
        },

        async addWeatherWidget() {
            this.beforeAdding();
            
            // When they're available, these should come from the org || weather preferences
            const zipcode = '84070';
            const metric = false;

            const { data } = await api.integration.weather({ zipcode, metric });

            const { city, state } = data.dailyForecasts.forecastLocation;
            const { forecast } = data.dailyForecasts.forecastLocation;

            const objects = [];

            // target dimensions
            // note that grouping objects adds an extra pixel - so the full-width objects are (widgetWidth - 1)
            const widgetWidth = 1165;
            const widgetHeight = 400;
            const padding = 30;
            
            const background = new fabric.TruRect({
                width: widgetWidth -1,
                height: widgetHeight - 1,
                fill: '#101E63',
                rx: 25,
                ry: 25
            });
            background.setGradient('fill', {
                x1: 0,
                y1: 0,
                x2: widgetWidth -1,
                y2: widgetHeight - 1,
                colorStops: {
                    '0': "#101E63",
                    '0.5': "#445BCD",
                    '1': "#101E63"
                }
            });
            objects.push(background);

            let top = padding;
            const title = new fabric.TruText('7-Day Forecast', {
                width: widgetWidth -1,
                fontSize: 50,
                textAlign: 'center',
                fill: '#f9ff33',
                top
            });
            objects.push(title);
            
            const locationText = `${city}, ${state}`;
            top += 60;
            const location = new fabric.TruText(locationText, {
                width: widgetWidth -1,
                fontSize: 26,
                textAlign: 'center',
                fill: '#77fef4',
                top,
            });
            objects.push(location);

            // create the day weather groups
            let left = padding;
            top += 45;
            for (let i = 0; i < forecast.length; i++) {
                const fc = forecast[i];
                const items = [];
                const groupWidth = 150;
                const margin = 10;

                let itemTop = 0;
                const promise = new Promise((resolve) => {
                    fabric.TruImage.fromURL(fc.iconLink, async image => {
                        image.set({
                            lockUniScaling: true,
                            width: 100,
                            height: 100,
                            left: 25,
                            top: itemTop
                        });
                        resolve(image);
                    });
                });
                const image = await promise;
                items.push(image);

                const hi = parseFloat(fc.highTemperature).toFixed(0);
                const hiText = `H:  ${hi}\u00B0F`;
                itemTop += 115;
                const high = new fabric.TruText(hiText, {
                    width: groupWidth - 1,
                    fontSize: 22,
                    textAlign: 'center',
                    fill: '#ffff00',
                    top: itemTop
                });
                items.push(high);

                const lo = parseFloat(fc.lowTemperature).toFixed(0);
                const loText = `L:  ${lo}\u00B0F`;
                itemTop += 30;
                const low = new fabric.TruText(loText, {
                    width: groupWidth - 1,
                    fontSize: 22,
                    textAlign: 'center',
                    fill: '#ffff00',
                    top: itemTop
                });
                items.push(low);

                const dayText = fc.weekday.substr(0, 3);
                itemTop += 35;
                const day = new fabric.TruText(dayText, {
                    width: groupWidth - 1,
                    height: 48,
                    fontSize: 38,
                    textAlign: 'center',
                    fill: '#fff',
                    top: itemTop
                });
                items.push(day);

                const options = {
                    top,
                    left,
                    subType: 'weather-day'
                };
                const group = new fabric.TruGroup(items, options);
                objects.push(group);

                left += groupWidth + margin;
            }

            const config = {
                zipcode,
                metric,
                location: locationText,
                showLocation: true,
                created: new Date()
            };

            const weatherWidget = new fabric.TruWeather(objects, { config });
            this.getFabric().add(weatherWidget);
            this.getFabric().setActiveObject(weatherWidget);

            // add a shadow
            this.setSelectedShadow({
                offsetX: 10,
                offsetY: 10,
                blur: 10,
                color: '#555'
            });

            this.afterAdding(weatherWidget);
            this.getFabric().requestRenderAll();
            this.center();
        }
    },
};
