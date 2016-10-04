var assetsEl;

function $(selector) {
    return document.querySelector(selector);
}

function onDOMContentLoaded() {
    assetsEl = $('a-assets');
}

function addTexture(image, id, onLoad) {
    var img = new Image();
    assetsEl.appendChild(img);
    img.id     = id;
    img.src    = dURL;
    img.onload = onLoad;
}


document.addEventListener('DOMContentLoaded', onDOMContentLoaded);