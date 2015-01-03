define([ "require", "exports", "module", "vendor/super-classy" ], function(require, exports, module, SuperClassy) {
    "use strict";
    module.exports = function() {
        var that = this;
        return SuperClassy.apply(that, arguments), that;
    };
});