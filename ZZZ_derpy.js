
var narf = document.getElementById('narf-text');
var { format } = narf.dataset;

// For reference when editing this file:
// var possibleTimeFormats = [
//     'HH:mm:ss',
//     'HH:mm',
//     'h:mm:ss a',
//     'h:mm a'
// ];

var is12Hour = format[format.length - 1] === 'a';
var includeSeconds = format.split(':').length === 3;;

tick();

function tick() {
    var now = new Date();
    let time;
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
    narf.innerHTML = time;
}

setInterval(function () {
    tick();
}, 1000);
