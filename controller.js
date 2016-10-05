var ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

var DEVICE_ID = localStorage.getItem('deviceId') || generateDeviceID();

if(DEVICE_ID === 'null') {
    DEVICE_ID = generateDeviceID();
}

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
        firebase_status : '#firebase_status'
    };

    // Run all values as selectors and save in place
    Object.keys(el).forEach(function (k) { el[k] = document.querySelector(el[k]);});

    el.deviceId.innerHTML        = DEVICE_ID;
    el.firebase_status.innerHTML = '<span style="color: green">Connected</span>';

    function onGyroNormData(data) {
        ref.set({
            rotation : [
                data.do.beta,
                data.do.alpha,
                data.do.gamma * -1
            ].join(' ')
        });
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