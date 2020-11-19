
const BASE_SIGNALS = [
    [ 0, 1 ],
    [ 0, 1, 2 ],
    [ 0, 1, 2 ]
];
const SIGNAL_LENGTH = 12;

function extendSignal(signal, length, offset) {
    return new Array(length).fill(0).map((_, i) => signal[(i + offset) % signal.length]);
}

function mergeSignals(signals) {
    const length = Math.max(...signals.map(signal => signal.length));
    return new Array(length).fill(0).map((_, i) => (
        signals.map(signal => i < signal.length ? signal[i] : 0)
            .reduce((a, b) => a + b)
    ));
}

function createSingleSignalReading(reading) {
    const entry = document.createElement('div');
    entry.classList.add('reading');

    for (let i = 0; i < reading; i++) {
        let block = document.createElement('div');
        block.classList.add('block');
        entry.appendChild(block);
    }

    return entry;
}

function renderSignalReadings(lock, leftReading, rightReading) {
    const row = document.createElement('div');
    row.classList.add('row');

    const lhs = document.createElement('div');
    lhs.classList.add('lhs');
    lhs.appendChild(createSingleSignalReading(leftReading));
    row.appendChild(lhs);

    const filler = document.createElement('div');
    filler.classList.add('filler');
    row.appendChild(filler);

    const rhs = document.createElement('div');
    rhs.classList.add('rhs');
    rhs.appendChild(createSingleSignalReading(rightReading));
    row.appendChild(rhs);

    lock.appendChild(row);
}

function renderSignals(lock, leftSignal, rightSignal) {
    leftSignal.forEach((leftReading, i) => {
        renderSignalReadings(lock, leftReading, rightSignal[i]);
    });
}

let offsets = [0, 1, 2];
let animating = false;

function getBaseSignals() {
    return offsets.map((_, i) => extendSignal(BASE_SIGNALS[i], SIGNAL_LENGTH, 0))
}

function getMergedBaseSignal() {
    return mergeSignals(getBaseSignals());
}

function getSignals() {
    return offsets.map((offset, i) => extendSignal(BASE_SIGNALS[i].slice().reverse(), SIGNAL_LENGTH, offset));
}

function getMergedSignal() {
    return mergeSignals(getSignals());
}

function render() {
    const lock = document.getElementById('lock');
    lock.innerHTML = '';

    const baseSignal = getMergedBaseSignal();
    const currentSignal = getMergedSignal();

    renderSignals(lock, baseSignal, currentSignal);
}

function main() {
    render();
}

function shiftSignal(index) {
    if (animating) {
        return;
    }
    offsets[index] = (offsets[index] + 1) % BASE_SIGNALS[index].length;
    render();
}

function testLock() {
    if (animating) {
        return;
    }
    animating = true;
    setButtonsDisabled(true);
    toggleCollapse();
    setTimeout(() => {
        const baseSignal = getMergedBaseSignal();
        const currentSignal = getMergedSignal();

        const sumSignal = mergeSignals([baseSignal, currentSignal]);
        const baseReading = sumSignal[0];

        // lock broken!
        if (sumSignal.every(reading => reading == baseReading)) {
            setBlockColour('green');
            const success = document.getElementById('success');
            success.classList.remove('hidden');
        } else {
            setBlockColour('red');
            setTimeout(() => {
                setBlockColour('');
                toggleCollapse();
                setTimeout(() => {
                    animating = false;
                    setButtonsDisabled(false);
                }, 1500);
            }, 1000);
            
        }
    }, 1500);
}

function setButtonsDisabled(disabled) {
    const buttons = document.getElementsByTagName('button');
    buttons.disabled = disabled;
}

function toggleCollapse() {
    const fillers = document.getElementsByClassName('filler');
    console.log(fillers);
    Array.from(fillers).forEach((filler) => {
        if (filler.classList.contains('collapse')) {
            filler.classList.remove('collapse');
        } else {
            filler.classList.add('collapse');
        }
    });
}

function setBlockColour(colour) {
    const blocks = document.getElementsByClassName('block');
    Array.from(blocks).forEach((block) => {
        block.style.backgroundColor = colour;
    });
}