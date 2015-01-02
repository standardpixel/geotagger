define([ "require", "module", "exports" ], function(n, e) {
    return e.exports = function() {
        "use strict";
        var n = this, e = {};
        return n.on = function(n) {
            e[n] || (e[n] = []), e[n].push(arguments);
        }, n.once = function() {
            return this.on.apply(n, [ arguments[0], arguments[1], arguments[2], !0 ]);
        }, n.fire = function(n, t) {
            e[n] && (e[n].forEach(function(n) {
                n[1]({
                    listener: n[2],
                    caller: t
                });
            }), e[n] = e[n].filter(function(n) {
                return !n[3];
            }));
        }, this.processTemplate = function(n, e) {
            return Object.keys(e).forEach(function(t) {
                n = n.split("{" + t + "}").join(e[t]);
            }), n;
        }, n.utils = {
            get: function(n, e) {
                return (e ? e : document).querySelectorAll(n);
            },
            debounce: function(n, e, t) {
                var r;
                return function() {
                    var u = this, i = arguments, o = function() {
                        r = null, t || n.apply(u, i);
                    }, a = t && !r;
                    clearTimeout(r), r = setTimeout(o, e), a && n.apply(u, i);
                };
            },
            request: function(n, e) {
                if (window && window.XMLHttpRequest) {
                    var t = null;
                    return t = new window.XMLHttpRequest(), t.onreadystatechange = function() {
                        4 === (0 | t.readyState) && (200 === (0 | t.status) ? e(null, t) : e(t));
                    }, t.open("GET", n, !1), t.send(null);
                }
                return !1;
            },
            parentHasClass: function(n, e, t) {
                for (var r = n, u = 0; (t || 10) > u && r; u++) {
                    if (r && r.className && r.className.indexOf(e) > -1) return r;
                    r = r.parentNode;
                }
                return null;
            },
            append: function(n, e) {
                var t = document.createElement("div");
                for (t.innerHTML = e; t.children.length > 0; ) n.appendChild(t.children[0]);
                return n;
            }
        }, this;
    };
});