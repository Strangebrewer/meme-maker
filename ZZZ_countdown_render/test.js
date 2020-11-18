"use strict";

var widgets = document.getElementsByClassName('countdown-container');

tick();

setInterval(function () {
    tick();
}, 1000);

function tick() {
    var now = new Date();

    for (var i = 0; i < widgets.length; i++) {
        var element = widgets[i];

        var date = element.dataset.date;
        var direction = element.dataset.direction;

        var target = new Date(date);

        const completed = direction === 'up' && isBefore(now, target) || direction === 'down' && isAfter(now, target);
        let interval = intervalToDuration({ start: now, end: target });

        // intervalToDuration returns days in the month, not total days since
        //  i.e. it returns 4 years, 10 months, 5 days, 16 hours, etc.
        //  so days have to be calculated separately
        const diffInDays = differenceInDays(now, target);

        var text = 0;

        for (var j = 0; j < element.children.length; j++) {
            const item = element.children[j];
            if (!completed) {
                if (item.className === 'countdown-days') text = Math.abs(diffInDays).toString();
                if (item.className === 'countdown-hours') text = interval.hours.toString();
                if (item.className === 'countdown-minutes') text = interval.minutes.toString();
                if (item.className === 'countdown-seconds') text = interval.seconds.toString();
            }
            item.children[0].innerHTML = text;
        }
    }
}
