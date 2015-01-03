define([ "require", "exports", "module", "fullscreen-overlay", "vendor/super-classy" ], function(require, exports, module, FullscreenOverlay, SuperClassy) {
    "use strict";
    function initMapOverlay() {
        fullscreenOverlay = new FullscreenOverlay("body .view", "photo-map", {
            className: "photo-map-overlay"
        }), $.utils.get(".photo-place-action")[0].addEventListener("click", function(e) {
            e.preventDefault(), fullscreenOverlay.show();
        }, !1), fullscreenOverlay.once("show", function() {
            require([ "photo-map" ], function() {});
        });
    }
    function init() {
        initMapOverlay();
    }
    console.log("STPX", STPX.viewData);
    var fullscreenOverlay, $ = new SuperClassy();
    init();
});