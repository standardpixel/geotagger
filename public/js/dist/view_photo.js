define([ "require", "exports", "module" ], function() {
    "use strict";
    console.log("STPX", STPX.viewData);
    var map = L.map(document.querySelector("#map"), {
        center: [ STPX.viewData.photo.location.latitude, STPX.viewData.photo.location.longitude ],
        zoom: 13,
        scrollWheelZoom: !1
    });
    L.tileLayer("http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png").addTo(map), 
    L.marker([ STPX.viewData.photo.location.latitude, STPX.viewData.photo.location.longitude ]).addTo(map);
});