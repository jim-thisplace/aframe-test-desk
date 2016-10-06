// Utils

function _debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later   = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * @param {string} s
 * @returns {Element|Element[]|undefined}
 */
function $(s) {
    return document.querySelector(s);
}

////////////////////////////////

var ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

var DEVICE_MODE = location.hash.slice(1) || 'gyronorm';
var DEVICE_ID   = localStorage.getItem('deviceId');

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
    $('#deviceMode').innerHTML = DEVICE_MODE;

    if (DEVICE_MODE === 'gyronorm') {
        initGyroNormTX(ref);
    } else if (DEVICE_MODE === 'xy') {
        initXYTX(ref);
    }
}

/**
 * @param ref - Firebase ref
 */
function initXYTX(ref) {
    var originX = 0;
    var originY = 0;

    function onTouchStart(e) {
        var t = e.changedTouches;

        // Support single touch point
        if (t.length === 1) {
            originX = t[0].pageX;
            originY = t[0].pageY;
        }
    }

    var dX     = 0;
    var prevDX = 0;
    var dY     = 0;
    var prevDY = 0;

    function onTouchMove(e) {
        var t = e.changedTouches;

        // Support single touch point
        if (t.length === 1) {
            dX = t[0].pageX - originX;
            dY = t[0].pageY - originY;

            // Send update
            if (prevDX !== dX || prevDY !== dY) {
                ref.set({
                    dx : dX,
                    dy : dY
                });
            }

            prevDY = dY;
            prevDX = dX;
        }
    }

    function onTouchEnd() {
        dX     = 0;
        prevDX = 0;
        dY     = 0;
        prevDY = 0;
    }

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', _debounce(onTouchMove, 25));
    window.addEventListener('touchend', onTouchEnd);
}

/**
 * @param ref - Firebase ref
 */
function initGyroNormTX(ref) {

    function onGyroNormData(_ref, data) {
        _ref.set({
            rotation : [
                data.do.beta,
                data.do.alpha,
                data.do.gamma * -1
            ].join(' ')
        });
    }

    var gn              = new GyroNorm();
    var _onGyroNormData = onGyroNormData.bind(null, ref);

    gn
        .init({ frequency : 25, decimalCount : 0 })
        .then(function () {
            gn.start(_onGyroNormData);
        })
        .catch(function (e) {
            console.error(e);
        });
}

function onGenerateNewDeviceIDClick() {
    generateDeviceID();
    window.reload();
}

function onDOMContentLoaded() {
    connect();
    $('#generateNewDeviceID').onclick = onGenerateNewDeviceIDClick;
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
window.ontouchmove = function (e) {
    e.preventDefault();
};