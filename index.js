var assetsEl;
var controlledBoxEl;

function $(selector) {
    return document.querySelector(selector);
}

function onSessionsValue(data) {
    var gnData = data.val();

    controlledBoxEl.setAttribute('rotation', {
        x : gnData.do.beta,
        y : gnData.do.alpha,
        z : gnData.do.gamma * -1
    });
}

function onDOMContentLoaded() {
    assetsEl        = $('a-assets');
    controlledBoxEl = $('#controlledBox');

    var deviceId = prompt('enter the controller device ID', localStorage.getItem('deviceId'));

    localStorage.setItem('deviceId', deviceId);

    firebase.database().ref('sessions/' + deviceId)
        .on('value', onSessionsValue);
}

function addTexture(image, id, onLoad) {
    var img = new Image();
    assetsEl.appendChild(img);
    img.id     = id;
    img.src    = dURL;
    img.onload = onLoad;
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);