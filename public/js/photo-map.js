define(["require","exports","module","vendor/super-classy"], function(
  require,
  exports,
  module,
  SuperClassy
) {

  "use strict";

  module.exports = function PhotoMap(options, callback) {

    var that = this;

    SuperClassy.apply(that, arguments);

    return that;

  };

});
