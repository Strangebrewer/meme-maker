
var narf = document.getElementsByClassName('narf-text');

// For reference when editing this file:
// var possibleTimeFormats = [
//     'HH:mm:ss',
//     'HH:mm',
//     'h:mm:ss a',
//     'h:mm a'
// ];

tick();

setInterval(function () {
    tick();
}, 1000);

function tick() {
    var now = new Date();
    var time;

    for (let i = 0; i < narf.length; i++) {
        const element = narf[i];

        var { format } = element.dataset;
    
        var is12Hour = format[format.length - 1] === 'a';
        var includeSeconds = format.split(':').length === 3;
        
        
        if (is12Hour) {
            if (includeSeconds) {
                time = now.toLocaleTimeString('en-US');
            } else {
                var timeArray = now.toLocaleTimeString('en-US').split(' ');
                var clock = timeArray[0].split(':');
                var meridian = timeArray[1];
                clock.pop();
                clock = clock.join(':');
                time = clock + ' ' + meridian;
            }
        } else {
            var timeString = now.toTimeString();
            var len = includeSeconds ? 8 : 5;
            time = timeString.substr(0, len);
        }
        element.innerHTML = time;
    }
}
