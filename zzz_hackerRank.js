function compareStrings(first, second, third) {    
    const arr = [];
    for (const key in arguments) {
        if (Object.hasOwnProperty.call(arguments, key)) {
            const element = arguments[key];
            arr.push(element);
        }
    }
    arr.sort();
    return arr.join('');
}

console.log('compareStrings("hackz", "hacker", "hackerstank"):::', compareStrings("hackz", "hackerrtank", "hackerstank"));

function lastLetters(word) {
    const len = word.length;
    return `${word[len-1]} ${word[len-2]}`;
}

console.log('lastLetters("shizzleDawG"):::', lastLetters("shizzleDawG"));

function sockMerchant(n, ar) {
    ar.sort();
    let pairs = 0;
    for (let i = 0; i < ar.length; i++) {
        const a = ar[i];
        const b = ar[i+1];
        if (a === b) {
            pairs += 1;
            i++;
        }
    }
    return pairs;
}

const socks = [2, 7, 2, 6, 5, 8, 12, 8, 2, 1, 15, 4, 4, 5, 2, 9, 7, 8, 1, 2, 6, 5];

const pairs = sockMerchant(socks.length, socks);

console.log('pairs:::', pairs);

function countingValleys(steps, path) {
    let level = 0;
    let valleys = 0;

    for (let i = 0; i < path.length; i++) {
        if (path[i] === 'U') {
            level++;
        }
        if (path[i] === 'D') {
            level--;
            if (level === -1) valleys ++;
        }
    }

    return valleys;
}

const path = 'UUDD DU DU DU DDDUUDUU DDUU';

const valleys = countingValleys(path.length, path);

console.log('valleys:::', valleys);