// this is a cribbed version of the date-fns functions we actually need
// so we can have a much smaller total file size
// minimized date-fns is ~70kB
// this script is 8.5kB (less if we minify it)

"use strict";

function intervalToDuration(interval) {
    var dateLeft = interval.start;
    var dateRight = interval.end;

    var duration = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    var sign = compareAsc(dateLeft, dateRight);
    duration.years = Math.abs(differenceInYears(dateLeft, dateRight));

    var remainingMonths = sub(dateLeft, { years: sign * duration.years });
    duration.months = Math.abs(differenceInMonths(remainingMonths, dateRight));

    var remainingDays = sub(remainingMonths, { months: sign * duration.months });
    duration.days = Math.abs(differenceInDays(remainingDays, dateRight));

    var remainingHours = sub(remainingDays, { days: sign * duration.days });
    duration.hours = Math.abs(differenceInHours(remainingHours, dateRight));

    var remainingMinutes = sub(remainingHours, { hours: sign * duration.hours });
    duration.minutes = Math.abs(differenceInMinutes(remainingMinutes, dateRight));

    var remainingSeconds = sub(remainingMinutes, { minutes: sign * duration.minutes });
    duration.seconds = Math.abs(differenceInSeconds(remainingSeconds, dateRight));

    return duration;
}

function compareAsc(dateLeft, dateRight) {
    var diff = dateLeft.getTime() - dateRight.getTime();
    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return diff;
}

function compareLocalAsc(dateLeft, dateRight) {
    var diff = dateLeft.getFullYear() - dateRight.getFullYear()
        || dateLeft.getMonth() - dateRight.getMonth()
        || dateLeft.getDate() - dateRight.getDate()
        || dateLeft.getHours() - dateRight.getHours()
        || dateLeft.getMinutes() - dateRight.getMinutes()
        || dateLeft.getSeconds() - dateRight.getSeconds()
        || dateLeft.getMilliseconds() - dateRight.getMilliseconds();

    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return diff;
}

function differenceInCalendarYears(dateLeft, dateRight) {
    return dateLeft.getFullYear() - dateRight.getFullYear();
}

function differenceInYears(dateLeft, dateRight) {
    dateLeft = new Date(dateLeft);
    dateRight = new Date(dateRight);

    var sign = compareAsc(dateLeft, dateRight);
    var diff = Math.abs(differenceInCalendarYears(dateLeft, dateRight));

    // I assume the date-fns guys know something relevant about the year 1584...
    dateLeft.setFullYear('1584');
    dateRight.setFullYear('1584');

    var lastYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
    var result = sign * (diff - lastYearNotFull); // prevent neg zero

    return result === 0 ? 0 : result;
}

function differenceInMonths(dateLeft, dateRight) {
    dateLeft = new Date(dateLeft);

    var sign = compareAsc(dateLeft, dateRight);
    var diff = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));

    dateLeft.setMonth(dateLeft.getMonth() - sign * diff);
    var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;

    var result = sign * (diff - isLastMonthNotFull);
    return result === 0 ? 0 : result;

}

function differenceInCalendarMonths(dateLeft, dateRight) {
    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    return yearDiff * 12 + monthDiff;
}

function differenceInDays(dateLeft, dateRight) {
    dateLeft = new Date(dateLeft);

    var sign = compareLocalAsc(dateLeft, dateRight);
    var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight));
    dateLeft.setDate(dateLeft.getDate() - sign * difference);

    var isLastDayNotFull = compareLocalAsc(dateLeft, dateRight) === -sign;
    var result = sign * (difference - isLastDayNotFull);

    return result === 0 ? 0 : result;
}

function differenceInCalendarDays(dateLeft, dateRight) {
    var MILLISECONDS_IN_DAY = 86400000;
    var startOfDayLeft = startofDay(dateLeft);
    var startOfDayRight = startofDay(dateRight);
    var timeStampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
    var timeStampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight);

    return Math.round((timeStampLeft - timeStampRight) / MILLISECONDS_IN_DAY);
}

function startofDay(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    return date;
}

function getTimezoneOffsetInMilliseconds(date) {
    date = new Date(date);
    var MILLISECONDS_IN_MINUTE = 60000;

    var baseTimezoneOffset = Math.ceil(date.getTimezoneOffset());
    date.setSeconds(0, 0);

    var hasNegativeUTCOffset = baseTimezoneOffset > 0;
    var millisecondsPartOfTimezoneOffset = hasNegativeUTCOffset
        ? MILLISECONDS_IN_MINUTE + (date.getTime() % MILLISECONDS_IN_MINUTE) % MILLISECONDS_IN_MINUTE
        : MILLISECONDS_IN_MINUTE;

    return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
}

function differenceInHours(dateLeft, dateRight) {
    var MILLISECONDS_IN_HOUR = 3600000;
    var diff = differenceInMilliseconds(dateLeft, dateRight) / MILLISECONDS_IN_HOUR;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

function differenceInMinutes(dateLeft, dateRight) {
    var MILLISECONDS_IN_MINUTE = 60000;
    var diff = differenceInMilliseconds(dateLeft, dateRight) / MILLISECONDS_IN_MINUTE;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

function differenceInSeconds(dateLeft, dateRight) {
    var diff = differenceInMilliseconds(dateLeft, dateRight) / 1000;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

function differenceInMilliseconds(dateLeft, dateRight) {
    return dateLeft.getTime() - dateRight.getTime();
}

function isBefore(dateLeft, dateRight) {
    return dateLeft.getTime() < dateRight.getTime();
}

function isAfter(dateLeft, dateRight) {
    return dateLeft.getTime() > dateRight.getTime();
}

function sub(date, duration) {
    if (!duration || typeof duration !== 'object') return new Date(NaN);

    var years = duration.years || 0;
    var months = duration.months || 0;
    var weeks = duration.weeks || 0;
    var days = duration.days || 0;
    var hours = duration.hours || 0;
    var minutes = duration.minutes || 0;
    var seconds = duration.seconds || 0;

    var dateWithoutMonths = subMonths(date, (months + years * 12));
    var dateWithoutDays = subDays(dateWithoutMonths, (days + weeks * 7));

    var minutesToSub = minutes + hours * 60;
    var secondsToSub = seconds + minutesToSub * 60;
    var msToSub = secondsToSub * 1000;

    var finalDate = new Date(dateWithoutDays.getTime() - msToSub);
    return finalDate;
}

function subMonths(date, amount) {
    return addMonths(date, -amount);
}

function addMonths(date, amount) {
    var dayOfMonth = date.getDate();
    var endOfDesiredMonth = new Date(date.getTime());
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
    var daysInMonth = endOfDesiredMonth.getDate();

    if (dayOfMonth >= daysInMonth) {
        return endOfDesiredMonth;
    } else {
        date = new Date(date);
        date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
        return date;
    }
}

function addDays(date, amount) {
    date = new Date(date);
    date.setDate(date.getDate() + amount);
    return date;
}

function subDays(date, amount) {
    return addDays(date, -amount);
}
