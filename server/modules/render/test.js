"use strict";

(function(window) {
    var fabric = window.fabric;
    fabric.KRect = fabric.util.createClass(fabric.Rect, { type: 'k-rect' });

    console.log('window:::', window);
})(window);