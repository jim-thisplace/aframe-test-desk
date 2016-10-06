/**
 * @param {string} s
 * @returns {Element|Element[]|undefined}
 */
function $(s) {
    return document.querySelector(s);
}

var ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

var DEVICE_ID = localStorage.getItem('deviceId');

if (!DEVICE_ID || DEVICE_ID === 'null') {
    DEVICE_ID = generateDeviceID();
}

/**
 * @param {number} [length]
 * @returns {string}
 */
function generateDeviceID(length) {
    var id = '';
    for (length = length || 4; length > 0; length--) {
        id += ID_CHARS[Math.floor(ID_CHARS.length * Math.random())];
    }

    localStorage.setItem('deviceId', id);
    printDeviceId();

    return id;
}

function printDeviceId() {
    $('#deviceId').innerHTML = DEVICE_ID;
}

function connect() {
    var ref = firebase.database().ref('sessions/' + DEVICE_ID);

    printDeviceId();
    $('#firebase_status').innerHTML = '<span style="color: green">Connected</span>';

    function onGyroNormData(data) {
        ref.set({
            rotation : [
                data.do.beta,
                data.do.alpha,
                data.do.gamma * -1
            ].join(' ')
        });
    }

    var gn = new GyroNorm();

    gn
        .init({ frequency : 25, decimalCount : 0 })
        .then(function () {
            gn.start(onGyroNormData);
        })
        .catch(function (e) {
            console.error(e);
        });
}

function onGenerateNewDeviceIDClick(){
    generateDeviceID();
    window.reload();
}

function onDOMContentLoaded() {
    connect();
    $('#generateNewDeviceID').onclick = onGenerateNewDeviceIDClick;
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);