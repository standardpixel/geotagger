define(["require","exports","module","handlebars","vendor/super-classy","../../js/helpers/removeSpaces.js","../../js/helpers/replace.js"], function(
  require,
  exports,
  module,
  Handlebars,
  SuperClassy
) {

  "use strict";

  module.exports = function Views(options, callback) {

    var that = this;

    SuperClassy.apply(that, arguments);

    function render(name) {
      var t  = Handlebars.partials[name],
          rt = (typeof t === "function") ? t : Handlebars.compile(t);

      that.fire("template-rendered", {
        "template" : rt,
        "name"     : name
      });

      return rt;
    }

    function initPartials(callback) {

      that.utils.request("/js/partials.json", function(err, r) {
        if (err) {
          callback(err);
        }

        try {
          Handlebars.partials = JSON.parse(r.responseText);
          callback(null);
        } catch (err) {
          callback(err);
        }
      });
    }

    function init () {

      if (!Object.keys(Handlebars.partials||{}).length) {
        initPartials(function() {

          if (callback) {
            callback(null, that);
          }
        });
      } else {
        if (callback) {
          callback(null, that);
        }
      }

      that.Handlebars = Handlebars;
      that.render     = render;
    }

    init();

  };

});
