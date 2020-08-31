import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from './helper';
import ical from 'ical';
import API from '../../../api';

export function addText(getFabric) {
    beforeAdding(getFabric);
    let isMouseDown = false;
    let object = null

    getFabric().on('mouse:down', ({ e }) => {
        isMouseDown = true;
        const pointer = getFabric().getPointer(e);

        object = new fabric.KText('', {
            top: pointer.y,
            left: pointer.x,
            width: 200
        });

        object.on('editing:exited', () => {
            if (!object.text.length) {
                getFabric().remove(object).requestRenderAll();
            } else {
                object.off('editing:exited');
            }
            afterAdding(getFabric);
        });

        getFabric().add(object);
        getFabric().defaultCursor = 'auto';
        
        getFabric().setActiveObject(object).requestRenderAll();
        object.enterEditing();
    });
}

export async function addCalendar(getFabric) {
    // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const url = 'https://calendar.google.com/calendar/ical/c_4h7ad8ft028k7sj9aksceqor74%40group.calendar.google.com/public/basic.ics';
    const { data } = await API.content.getCalendar(url);
    console.log('data:::', data);
    // const data = ical.parseICS(yeah.data.ical);

    beforeAdding(getFabric);
    getFabric().on('mouse:down', ({ e }) => {
        const pointer = getFabric().getPointer(e);
    
        for (const k in data) {
            if (data.hasOwnProperty(k)) {
                const ev = data[k];
    
                let object = new fabric.KText(ev.summary, {
                    top: pointer.y,
                    left: pointer.x,
                    width: 500
                });
    
                getFabric().add(object);
                getFabric().defaultCursor = 'auto';
                
                getFabric().setActiveObject(object);
                // console.log(`${ev.summary} is in ${ev.location} on the ${ev.start.getDate()} of ${months[ev.start.getMonth()]} at ${ev.start.toLocaleTimeString('en-GB')}`);
            }
        }
        afterAdding(getFabric);
        getFabric().requestRenderAll();
    });
}
