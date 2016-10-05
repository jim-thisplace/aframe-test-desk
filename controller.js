var ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

var DEVICE_ID = localStorage.getItem('deviceId') || generateDeviceID();

/**
 * @param {number} [length]
 * @returns {string}
 */
function generateDeviceID(length) {
    var id = '';
    for (length = length || 5; length > 0; length--) {
        id += ID_CHARS[Math.floor(ID_CHARS.length * Math.random())];
    }

    localStorage.setItem('deviceId', id);

    return id;
}

function onSessionsValue() {
    var ref = firebase.database().ref('sessions/' + DEVICE_ID);

    var el = {
        deviceId        : '#deviceId',
        firebase_status : '#firebase_status',
        doalpha         : '#doalpha',
        dobeta          : '#dobeta',
        dogamma         : '#dogamma',
        dmx             : '#dmx',
        dmy             : '#dmy',
        dmz             : '#dmz',
        dmgx            : '#dmgx',
        dmgy            : '#dmgy',
        dmgz            : '#dmgz'
    };

    // Run all values as selectors and save in place
    Object.keys(el).forEach(function (k) { el[k] = document.querySelector(el[k]);});

    el.deviceId.innerHTML        = DEVICE_ID;
    el.firebase_status.innerHTML = '<span style="color: green">Connected</span>';

    var gn = new GyroNorm();

    function writeDebugInfo(data){
        el.doalpha.innerHTML = data.do.alpha;
        el.dobeta.innerHTML  = data.do.beta;
        el.dogamma.innerHTML = data.do.gamma;

        el.dmx.innerHTML = data.dm.x;
        el.dmy.innerHTML = data.dm.y;
        el.dmz.innerHTML = data.dm.z;

        el.dmgx.innerHTML = data.dm.gx;
        el.dmgy.innerHTML = data.dm.gy;
        el.dmgz.innerHTML = data.dm.gz;
    }

    function onGyroNormData(data) {
        writeDebugInfo(data);
        ref.set(data);
    }

    gn
        .init({ frequency : 25, decimalCount : 0 })
        .then(function () {
            gn.start(onGyroNormData);
        })
        .catch(function (e) {
            console.error(e);
        });
}

function onDOMContentLoaded() {
    firebase.database().ref('sessions')
        .on('value', onSessionsValue);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);