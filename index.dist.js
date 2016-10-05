(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var assetsEl;
var controlledBoxEl;

function $(selector) {
    return document.querySelector(selector);
}

function onSessionsValue(data) {
    var gnData = data.val();

    controlledBoxEl.setAttribute('rotation', gnData.rotation);
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
},{}]},{},[1]);
