define(["require","exports", "module", "fullscreen-overlay", "vendor/super-classy"], function(
  require,
  exports,
  module,
  FullscreenOverlay,
  SuperClassy
) {

  "use strict";

  console.log("STPX",STPX.viewData);

  var $ = new SuperClassy(),
      fullscreenOverlay;

  function initMapOverlay() {

    fullscreenOverlay = new FullscreenOverlay("body .view", "photo-map", {
      "className" : "photo-map-overlay"
    });

    $.utils.get(".photo-place-action")[0].addEventListener("click", function(e) {

      e.preventDefault();

      fullscreenOverlay.show();

    }, false);

    fullscreenOverlay.once("show", function() {
      require(["photo-map"], function(photoMap) {});
    });

  }

  function init() {
    initMapOverlay();
  }

  //
  // Proceed!
  //
  init();

  /*
  var map = L.map(document.querySelector("#map"), {
    center          : [STPX.viewData.photo.location.latitude, STPX.viewData.photo.location.longitude],
    zoom            : 13,
    scrollWheelZoom : false,
    dragging        : false,
    touchZoom       : false,
    doubleClickZoom : false,
    zoomControl     : false
  });

  L.tileLayer("http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png").addTo(map);

  L.marker([STPX.viewData.photo.location.latitude, STPX.viewData.photo.location.longitude]).addTo(map);
  */

});
