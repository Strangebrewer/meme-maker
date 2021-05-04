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

// console.log('compareStrings("hackz", "hacker", "hackerstank"):::', compareStrings("hackz", "hackerrtank", "hackerstank"));

function lastLetters(word) {
    const len = word.length;
    return `${word[len-1]} ${word[len-2]}`;
}

// console.log('lastLetters("shizzleDawG"):::', lastLetters("shizzleDawG"));

function sockMerchant(ar) {
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

// const socks = [2, 7, 2, 6, 5, 8, 12, 8, 2, 1, 15, 4, 4, 5, 2, 9, 7, 8, 1, 2, 6, 5];
// const pairs = sockMerchant(socks);
// console.log('pairs:::', pairs);

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

// const path = 'UUDD DU DU DU DDDUUDUU DDUU';
// const valleys = countingValleys(path.length, path);
// console.log('valleys:::', valleys);

const sampleTree = {
    a: 2,
    b: 1,
    c: {
        c1: 1,
        c2: 1,
        c3: {
            c3a: 1,
            c3b: 1,
            c3c: 1,
        }
    },
    f: 1,
    g: 1,
    "": 1,
    m: 1,
    p: 1,
    r: 1,
    f: 1,
    poop: {
        p1: 1,
        p2: 1,
        p3: 1,
        p4: {
            poo1: 1,
            poo2: 1,
            poo3: {
                der: 1,
                derp: 1,
                derpy: {
                    d: 1,
                    d2: 1,
                    d3: 1
                }
            }
        }
    },
    // h: '1',
    // d: 'yep',
    // e: null,
};

function areAllLeavesEqual(tree) {
    let first = null;
    let isEqual = true;
    
    for (const key in tree) {
        if (first === null) {
            first = tree[key];
            continue;
        }

        if (typeof tree[key] === 'object' && tree[key] !== null) {
            isEqual = areAllLeavesEqual(tree[key]);
            if (!isEqual) break;
            continue;
        }

        if (tree[key] !== first) {
            isEqual = false;
            break;
        }
    }

    return isEqual;
}

function toArrayEqual(tree) {
    let first = null;
    let isEqual = true;
    const values = [];

    function toArray(obj) {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const el = obj[key];

                if (first === null) first = el;
            
                if (typeof el === 'object' && el !== null) {
                    toArray(el);
                    continue;
                }

                values.push(el);
            }
        }
    }
    
    toArray(tree);

    for (let i = 0; i < values.length; i++) {
        if (values[i] !== first) {
            isEqual = false;
            break;
        }
    }

    return isEqual;
}

function flattenObjectEqual(tree) {
    let first = null;
    let isEqual = true;

    function flatten(obj, prefix = false, result = null) {
        result = result || {};
        prefix = prefix ? prefix + '.' : '';

        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const el = obj[key];
                
                if (typeof el === 'object' && el !== null) {
                    flatten(el, prefix + key, result);
                } else {
                    result[prefix + key] = el;
                }
            }
        }

        return result;
    }

    tree = flatten(tree);

    for (const key in tree) {
        if (Object.hasOwnProperty.call(tree, key)) {
            const el = tree[key];
            if (first === null) {
                first = el;
                continue;
            }

            if (first !== el) {
                isEqual = false;
                break;
            }
        }
    }

    return isEqual;
}

function takeUpTime(tree) {
    let funky = '';
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';

    for (const key in tree) {
        if (Object.hasOwnProperty.call(tree, key)) {
            funky += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
    }
    
    return funky;
}



// console.log('\n');

// console.time('timer-setup');
// console.log('takeUpTime:::', takeUpTime(sampleTree));
// console.timeEnd('timer-setup');

// console.log('\n');

// console.time('timer-three');
// console.log('flattenObjectEqual - are they equal?:::', flattenObjectEqual(sampleTree));
// console.timeEnd('timer-three');

// console.log('\n');

// console.time('timer-two');
// console.log('toArrayEqual - are they equal?:::', toArrayEqual(sampleTree));
// console.timeEnd('timer-two');

// console.log('\n');

// console.time('timer');
// console.log('areAllLeavesEqual - are they equal?:::', areAllLeavesEqual(sampleTree));
// console.timeEnd('timer');
