define(["require","exports", "module", "fullscreen-overlay", "vendor/super-classy"], function(
  require,
  exports,
  module,
  FullscreenOverlay,
  SuperClassy
) {

  "use strict";

  var $ = new SuperClassy(),
      fullscreenOverlay, photoMap;

  function openMapOverlay(e) {

    e.preventDefault();

    fullscreenOverlay.show();

  }

  function initMapOverlay() {

    fullscreenOverlay = new FullscreenOverlay("body .view", "photo-map", {
      "className" : "photo-map-overlay"
    });

    $.utils.get(".photo-place-action")[0].addEventListener("click", openMapOverlay, false);
    $.utils.get(".actions .open-map")[0].addEventListener("click", openMapOverlay, false);

    fullscreenOverlay.once("show", function() {
      require(["photo-map"], function(PhotoMap) {
        photoMap = new PhotoMap(".photo-map-overlay section", {
          "photo" : STPX.viewData.photo
        });
      });
    });

  }

  function init() {
    initMapOverlay();
  }

  //
  // Proceed!
  //
  init();

});
