var assetsEl;
var controlledBoxEl;
var bikestandEl;

function $(selector) {
    return document.querySelector(selector);
}

var bikestandPosition;

function onSessionsValue(data) {
    var res = data.val();

    if (res.isTouchEnd) {
        bikestandPosition[0] += res.dx * 0.15;
        bikestandPosition[2] += res.dy * 0.15;

        bikestandEl.setAttribute('position', bikestandPosition.join(' '));
    } else {

        bikestandEl.setAttribute('position', [
            bikestandPosition[0] + res.dx * 0.15,
            0,
            bikestandPosition[2] + res.dy * 0.15
        ].join(' '));
    }

}

function onDOMContentLoaded() {
    bikestandEl     = $('#bikestand');
    assetsEl        = $('a-assets');
    controlledBoxEl = $('#controlledBox');

    var deviceId = location.hash.slice(1) || localStorage.getItem('deviceId');

    bikestandPosition = bikestandEl.getAttribute('position').split(' ')
        .map(parseFloat);

    localStorage.setItem('deviceId', deviceId);

    firebase.database().ref('sessions/' + deviceId)
        .on('value', onSessionsValue);
}


document.addEventListener('DOMContentLoaded', onDOMContentLoaded);