var AFrame = require('aframe');

var videoEl;

function resetAndPlayVideo() {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.play();
}

function $(selector) {
    return document.querySelector(selector);
}

function onDOMContentLoaded() {
    var videoEl = $('video');
}

function onKeyDown() {

}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
window.addEventListener('keydown', onKeyDown);