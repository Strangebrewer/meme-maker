import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from '../helper';
import API from '../../../../api';

export async function horizontalWeatherWidget(getFabric, pushVersion) {
    beforeAdding(getFabric);
    const weather = await API.widget.getWeather('84010', false);
    console.log('weather:::', weather);

    const objects = [];
    const title = new fabric.KText('Ticking away', {
        fontSize: 40,
        fill: 'red',
        width: 600
    });
    objects.push(title);

    const subtitle = new fabric.KText('the moments that make up a dull day', {
        fontSize: 30,
        fill: 'blue',
        top: 45,
        width: 600
    });
    objects.push(subtitle);

    const widget = new fabric.Weather(objects, {
        top: 100,
        left: 150,
        width: 600
    });

    getFabric().add(widget);


    afterAdding(getFabric);
    getFabric().setActiveObject(widget).requestRenderAll();
    pushVersion();
}

export function verticalWeatherWidget(getFabric, pushVersion) {
    beforeAdding(getFabric);
    const objects = [];

    const widget = '';


    afterAdding(getFabric);
    getFabric().setActiveObject(widget).requestRenderAll();
    pushVersion();
}