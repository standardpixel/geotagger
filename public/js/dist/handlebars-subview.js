define([ "require", "exports", "module", "handlebars", "vendor/super-classy", "../../js/helpers/removeSpaces.js", "../../js/helpers/replace.js" ], function(require, exports, module, Handlebars, SuperClassy) {
    "use strict";
    module.exports = function(options, callback) {
        function render(name) {
            var t = Handlebars.partials[name], rt = "function" == typeof t ? t : Handlebars.compile(t);
            return that.fire("template-rendered", {
                template: rt,
                name: name
            }), rt;
        }
        function initPartials(callback) {
            that.utils.request("/js/partials.json", function(err, r) {
                err && callback(err);
                try {
                    Handlebars.partials = JSON.parse(r.responseText), callback(null);
                } catch (err) {
                    callback(err);
                }
            });
        }
        function init() {
            Object.keys(Handlebars.partials || {}).length ? callback && callback(null, that) : initPartials(function() {
                callback && callback(null, that);
            }), that.Handlebars = Handlebars, that.render = render;
        }
        var that = this;
        SuperClassy.apply(that, arguments), init();
    };
});