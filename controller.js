// Utils

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now  = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
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
    $('#deviceMode').innerHTML      = DEVICE_MODE;

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
            ref.set({
                dx : -dX,
                dy : -dY
            });

            prevDY = dY;
            prevDX = dX;
        }
    }

    function onTouchEnd(e) {
        var t = e.changedTouches;

        // Support single touch point
        if (t.length === 1) {
            dX = t[0].pageX - originX;
            dY = t[0].pageY - originY;

            ref.set({
                dx         : dX,
                dy         : dY,
                isTouchEnd : true
            });

            dX     = 0;
            prevDX = 0;
            dY     = 0;
            prevDY = 0;
        }
    }

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', throttle(onTouchMove, 10));
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
            ].join(' '),

            dx : data.dm.x,
            dy : data.dm.y,
            dz : data.dm.z
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