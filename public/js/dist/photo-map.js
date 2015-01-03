define([ "require", "exports", "module", "vendor/super-classy" ], function(require, exports, module, SuperClassy) {
    "use strict";
    module.exports = function(rootSelector, options, callback) {
        function initMap() {
            var map = L.map("photo-map", {
                center: [ options.photo.location.latitude, options.photo.location.longitude ],
                zoom: 13,
                scrollWheelZoom: !1,
                dragging: !1,
                touchZoom: !1,
                doubleClickZoom: !1,
                zoomControl: !1
            });
            L.tileLayer("http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png").addTo(map), 
            L.marker([ options.photo.location.latitude, options.photo.location.longitude ], {
                icon: L.divIcon({
                    className: "pinwin"
                })
            }).addTo(map), that.utils.get(".pinwin", rootElement)[0].innerHTML = '<div class="photo" style="background-image:url(\'//c1.staticflickr.com/' + options.photo.farm + "/" + options.photo.server + "/" + options.photo.id + "_" + options.photo.secret + ".jpg');\"></div>";
        }
        function init(callback) {
            initMap(), callback();
        }
        var rootElement, that = this;
        return console.log("photo-map", options), SuperClassy.apply(that, arguments), rootElement = that.utils.get(rootSelector)[0], 
        init(function() {
            callback && callback(), that.fire("ready");
        }), that;
    };
});