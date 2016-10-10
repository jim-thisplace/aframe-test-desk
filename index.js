var EL = {
    'cursor'            : null,
    'floor'             : null,
    'floorCursorSphere' : null,
    'floorCursorLine'   : null
};


function onFloorRaycasterIntersected(e) {
    var vec3 = e.detail.intersection.point;
    setFloorCursorPosition(vec3);
    setFloorCursorPosition(vec3);
}

function setFloorCursorPosition(vec3) {
    EL.floorCursorSphere.setAttribute('position', vec3);
    EL.floorCursorLine.setAttribute('line', 'path: 0 0 0, '+
        AFRAME.utils.coordinates.stringify(vec3)
    );
}

function onDOMContentLoaded() {
    // Run all values as selectors and save in place
    Object.keys(EL).forEach(function (k) { EL[k] = document.getElementById(k);});

    EL.floor.addEventListener('raycaster-intersected', onFloorRaycasterIntersected);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);