function e(e) {
    for (var t = {}, r = e.split(","), n = 0; n < r.length; n++) t[r[n]] = !0;
    return t;
}

function t(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<!doctype.*\>\n/, "").replace(/<!DOCTYPE.*\>\n/, "");
}

function r(e) {
    var t = [];
    if (0 == o.length || !a) return (l = {}).node = "text", l.text = e, n = [ l ];
    e = e.replace(/\[([^\[\]]+)\]/g, ":$1:");
    for (var r = new RegExp("[:]"), n = e.split(r), i = 0; i < n.length; i++) {
        var d = n[i], l = {};
        a[d] ? (l.node = "element", l.tag = "emoji", l.text = a[d], l.baseSrc = s) : (l.node = "text", 
        l.text = d), t.push(l);
    }
    return t;
}

var n = "https", o = "", s = "", a = {}, i = require("wxDiscode.js"), d = require("htmlparser.js"), l = (e("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"), 
e("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video")), c = e("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), p = e("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

e("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), 
e("wxxxcode-style,script,style,view,scroll-view,block");

module.exports = {
    html2json: function(e, o) {
        e = t(e), e = i.strDiscode(e);
        var s = [], a = {
            node: o,
            nodes: [],
            images: [],
            imageUrls: []
        };
        return d(e, {
            start: function(e, t, r) {
                var d = {
                    node: "element",
                    tag: e
                };
                if (l[e] ? d.tagType = "block" : c[e] ? d.tagType = "inline" : p[e] && (d.tagType = "closeSelf"), 
                0 !== t.length && (d.attr = t.reduce(function(e, t) {
                    var r = t.name, n = t.value;
                    return "class" == r && (console.dir(n), d.classStr = n), "style" == r && (console.dir(n), 
                    d.styleStr = n), n.match(/ /) && (n = n.split(" ")), e[r] ? Array.isArray(e[r]) ? e[r].push(n) : e[r] = [ e[r], n ] : e[r] = n, 
                    e;
                }, {})), "img" === d.tag) {
                    d.imgIndex = a.images.length;
                    var u = d.attr.src;
                    u = i.urlToHttpUrl(u, n), d.attr.src = u, d.from = o, a.images.push(d), a.imageUrls.push(u);
                }
                if (r) {
                    var m = s[0] || a;
                    void 0 === m.nodes && (m.nodes = []), m.nodes.push(d);
                } else s.unshift(d);
            },
            end: function(e) {
                var t = s.shift();
                if (t.tag !== e && console.error("invalid state: mismatch end tag"), 0 === s.length) a.nodes.push(t); else {
                    var r = s[0];
                    void 0 === r.nodes && (r.nodes = []), r.nodes.push(t);
                }
            },
            chars: function(e) {
                var t = {
                    node: "text",
                    text: e,
                    textArray: r(e)
                };
                if (0 === s.length) a.nodes.push(t); else {
                    var n = s[0];
                    void 0 === n.nodes && (n.nodes = []), n.nodes.push(t);
                }
            },
            comment: function(e) {
                var t = {
                    node: "comment",
                    text: e
                }, r = s[0];
                void 0 === r.nodes && (r.nodes = []), r.nodes.push(t);
            }
        }), a;
    },
    emojisInit: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", r = arguments[2];
        o = e, s = t, a = r;
    }
};