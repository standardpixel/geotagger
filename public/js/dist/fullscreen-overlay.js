define([ "require", "exports", "module", "handlebars-subview", "super-classy" ], function(require, exports, module, Views, SuperClassy) {
    "use strict";
    module.exports = function(rootSelector, template, options) {
        function draw(data) {
            var content = views.render(template)(data);
            return that.fire("draw"), content;
        }
        function initContainer() {
            return containerElement = document.createElement("div"), options.className && (containerElement.className = options.className), 
            containerElement.classList.add("fullscreen-overlay"), containerElement.style.display = "none", 
            containerElement.style.position = "fixed", containerElement.style.top = 0, containerElement.style.right = 0, 
            containerElement.style.bottom = 0, containerElement.style.left = 0, containerElement.style.zIndex = 100, 
            containerElement.style.width = "100vw", containerElement.style.height = "100vh", 
            containerElement.style.overflow = "auto", containerElement.addEventListener("mousewheel", function(e) {
                e.preventDefault();
            }, !1), rootElement.appendChild(containerElement), containerElement;
        }
        function show() {
            drawn || (containerElement.innerHTML = draw({}), drawn = !0), containerElement.style.display = "block", 
            setTimeout(function() {
                containerElement.classList.add("showing");
            }, 200), that.fire("show");
        }
        function hide() {
            setTimeout(function() {
                containerElement.style.display = "none";
            }, 500), containerElement.classList.remove("showing"), that.fire("hide");
        }
        function initActions() {
            var closeAction = that.utils.get(".action.close", rootElement)[0];
            closeAction && closeAction.addEventListener("click", function(e) {
                e.preventDefault(), hide();
            }, !1);
        }
        function init(callback) {
            rootElement = that.utils.get(rootSelector)[0], initContainer(), that.once("show", function() {
                initActions();
            }), callback();
        }
        var rootElement, containerElement, drawn, that = this, views = new Views();
        return options = options || {}, SuperClassy.apply(this, arguments), that.draw = draw, 
        that.show = show, that.hide = hide, that.container = containerElement, init(function() {
            that.fire("ready");
        }), that;
    };
});