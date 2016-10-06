var assetsEl;
var controlledBoxEl;
var bikestandEl;

function $(selector) {
    return document.querySelector(selector);
}

var bikestandPosition;
var lastDx = 0;
var lastDy = 0;

var SCALE_FACTOR = 0.15;

function onSessionsValue(data) {
    var res = data.val();

    if (res.isTouchEnd) {

        bikestandPosition.x += lastDx;
        bikestandPosition.z += lastDy;

    } else {
        lastDx = res.dx * SCALE_FACTOR;
        lastDy = res.dy * SCALE_FACTOR;

        bikestandEl.setAttribute('position', {
            x : bikestandPosition.x + lastDx,
            y : 0,
            z : bikestandPosition.z + lastDy
        });

    }

}

function onDOMContentLoaded() {
    bikestandEl     = $('#bikestand');
    assetsEl        = $('a-assets');
    controlledBoxEl = $('#controlledBox');

    var deviceId = location.hash.slice(1) || localStorage.getItem('deviceId');

    bikestandPosition = bikestandEl.getAttribute('position');

    localStorage.setItem('deviceId', deviceId);

    firebase.database().ref('sessions/' + deviceId)
        .on('value', onSessionsValue);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);