define([ "require", "exports", "module", "fullscreen-overlay", "vendor/super-classy" ], function(require, exports, module, FullscreenOverlay, SuperClassy) {
    "use strict";
    function openMapOverlay(e) {
        e.preventDefault(), fullscreenOverlay.show();
    }
    function initMapOverlay() {
        fullscreenOverlay = new FullscreenOverlay("body .view", "photo-map", {
            className: "photo-map-overlay"
        }), $.utils.get(".photo-place-action")[0].addEventListener("click", openMapOverlay, !1), 
        $.utils.get(".actions .open-map")[0].addEventListener("click", openMapOverlay, !1), 
        fullscreenOverlay.once("show", function() {
            require([ "photo-map" ], function(PhotoMap) {
                photoMap = new PhotoMap(".photo-map-overlay section", {
                    photo: STPX.viewData.photo
                });
            });
        }), fullscreenOverlay.on("show", function() {
            photoMap && photoMap.mapInstance && photoMap.mapInstance.invalidateSize();
        });
    }
    function init() {
        initMapOverlay();
    }
    var fullscreenOverlay, photoMap, $ = new SuperClassy();
    init();
});