!function(e,t){"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document")
return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){function n(e){var t="length"in e&&e.length,n=K.type(e)
return"function"!==n&&!K.isWindow(e)&&(!(1!==e.nodeType||!t)||("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e))}function r(e,t,n){if(K.isFunction(t))return K.grep(e,function(e,r){return!!t.call(e,r,e)!==n})
if(t.nodeType)return K.grep(e,function(e){return e===t!==n})
if("string"==typeof t){if(se.test(t))return K.filter(t,e,n)
t=K.filter(t,e)}return K.grep(e,function(e){return X.call(t,e)>=0!==n})}function i(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}function o(e){var t=pe[e]={}
return K.each(e.match(fe)||[],function(e,n){t[n]=!0}),t}function s(){Q.removeEventListener("DOMContentLoaded",s,!1),e.removeEventListener("load",s,!1),K.ready()}function a(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=K.expando+a.uid++}function u(e,t,n){var r
if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ye,"-$1").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===n||"false"!==n&&("null"===n?null:+n+""===n?+n:me.test(n)?K.parseJSON(n):n)}catch(e){}ve.set(e,t,n)}else n=void 0
return n}function l(){return!0}function c(){return!1}function f(){try{return Q.activeElement}catch(e){}}function p(e,t){return K.nodeName(e,"table")&&K.nodeName(11!==t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function d(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function h(e){var t=Oe.exec(e.type)
return t?e.type=t[1]:e.removeAttribute("type"),e}function g(e,t){for(var n=0,r=e.length;r>n;n++)ge.set(e[n],"globalEval",!t||ge.get(t[n],"globalEval"))}function v(e,t){var n,r,i,o,s,a,u,l
if(1===t.nodeType){if(ge.hasData(e)&&(o=ge.access(e),s=ge.set(t,o),l=o.events)){delete s.handle,s.events={}
for(i in l)for(n=0,r=l[i].length;r>n;n++)K.event.add(t,i,l[i][n])}ve.hasData(e)&&(a=ve.access(e),u=K.extend({},a),ve.set(t,u))}}function m(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[]
return void 0===t||t&&K.nodeName(e,t)?K.merge([e],n):n}function y(e,t){var n=t.nodeName.toLowerCase()
"input"===n&&Te.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}function x(t,n){var r,i=K(n.createElement(t)).appendTo(n.body),o=e.getDefaultComputedStyle&&(r=e.getDefaultComputedStyle(i[0]))?r.display:K.css(i[0],"display")
return i.detach(),o}function b(e){var t=Q,n=Me[e]
return n||("none"!==(n=x(e,t))&&n||(Re=(Re||K("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),(t=Re[0].contentDocument).write(),t.close(),n=x(e,t),Re.detach()),Me[e]=n),n}function w(e,t,n){var r,i,o,s,a=e.style
return(n=n||Ie(e))&&(s=n.getPropertyValue(t)||n[t]),n&&(""!==s||K.contains(e.ownerDocument,e)||(s=K.style(e,t)),$e.test(s)&&We.test(t)&&(r=a.width,i=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=s,s=n.width,a.width=r,a.minWidth=i,a.maxWidth=o)),void 0!==s?s+"":s}function T(e,t){return{get:function(){return e()?void delete this.get:(this.get=t).apply(this,arguments)}}}function C(e,t){if(t in e)return t
for(var n=t[0].toUpperCase()+t.slice(1),r=t,i=Ve.length;i--;)if((t=Ve[i]+n)in e)return t
return r}function N(e,t,n){var r=_e.exec(t)
return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function k(e,t,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;4>o;o+=2)"margin"===n&&(s+=K.css(e,n+be[o],!0,i)),r?("content"===n&&(s-=K.css(e,"padding"+be[o],!0,i)),"margin"!==n&&(s-=K.css(e,"border"+be[o]+"Width",!0,i))):(s+=K.css(e,"padding"+be[o],!0,i),"padding"!==n&&(s+=K.css(e,"border"+be[o]+"Width",!0,i)))
return s}function E(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Ie(e),s="border-box"===K.css(e,"boxSizing",!1,o)
if(0>=i||null==i){if((0>(i=w(e,t,o))||null==i)&&(i=e.style[t]),$e.test(i))return i
r=s&&(G.boxSizingReliable()||i===e.style[t]),i=parseFloat(i)||0}return i+k(e,t,n||(s?"border":"content"),r,o)+"px"}function S(e,t){for(var n,r,i,o=[],s=0,a=e.length;a>s;s++)(r=e[s]).style&&(o[s]=ge.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&we(r)&&(o[s]=ge.access(r,"olddisplay",b(r.nodeName)))):(i=we(r),"none"===n&&i||ge.set(r,"olddisplay",i?n:K.css(r,"display"))))
for(s=0;a>s;s++)(r=e[s]).style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"))
return e}function D(e,t,n,r,i){return new D.prototype.init(e,t,n,r,i)}function j(){return setTimeout(function(){Ye=void 0}),Ye=K.now()}function A(e,t){var n,r=0,i={height:e}
for(t=t?1:0;4>r;r+=2-t)n=be[r],i["margin"+n]=i["padding"+n]=e
return t&&(i.opacity=i.width=e),i}function L(e,t,n){for(var r,i=(et[t]||[]).concat(et["*"]),o=0,s=i.length;s>o;o++)if(r=i[o].call(n,t,e))return r}function q(e,t){var n,r,i,o,s
for(n in e)if(r=K.camelCase(n),i=t[r],o=e[n],K.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(s=K.cssHooks[r])&&"expand"in s){o=s.expand(o),delete e[r]
for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function H(e,t,n){var r,i,o=0,s=Ze.length,a=K.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1
for(var t=Ye||j(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,s=l.tweens.length;s>o;o++)l.tweens[o].run(r)
return a.notifyWith(e,[l,r,n]),1>r&&s?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:K.extend({},t),opts:K.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Ye||j(),duration:n.duration,tweens:[],createTween:function(t,n){var r=K.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing)
return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0
if(i)return this
for(i=!0;r>n;n++)l.tweens[n].run(1)
return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props
for(q(c,l.opts.specialEasing);s>o;o++)if(r=Ze[o].call(l,e,c,l.opts))return r
return K.map(c,L,l),K.isFunction(l.opts.start)&&l.opts.start.call(e,l),K.fx.timer(K.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function O(e){return function(t,n){"string"!=typeof t&&(n=t,t="*")
var r,i=0,o=t.toLowerCase().match(fe)||[]
if(K.isFunction(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function F(e,t,n,r){function i(a){var u
return o[a]=!0,K.each(e[a]||[],function(e,a){var l=a(t,n,r)
return"string"!=typeof l||s||o[l]?s?!(u=l):void 0:(t.dataTypes.unshift(l),i(l),!1)}),u}var o={},s=e===vt
return i(t.dataTypes[0])||!o["*"]&&i("*")}function P(e,t){var n,r,i=K.ajaxSettings.flatOptions||{}
for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n])
return r&&K.extend(!0,e,r),e}function R(e,t,n){for(var r,i,o,s,a=e.contents,u=e.dataTypes;"*"===u[0];)u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"))
if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i)
break}if(u[0]in n)o=u[0]
else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i
break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):void 0}function M(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice()
if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s]
for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u
else if("*"!==u&&u!==o){if(!(s=l[u+" "+o]||l["* "+o]))for(i in l)if((a=i.split(" "))[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){!0===s?s=l[i]:!0!==l[i]&&(o=a[0],c.unshift(a[1]))
break}if(!0!==s)if(s&&e.throws)t=s(t)
else try{t=s(t)}catch(e){return{state:"parsererror",error:s?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}function W(e,t,n,r){var i
if(K.isArray(t))K.each(t,function(t,i){n||wt.test(e)?r(e,i):W(e+"["+("object"==typeof i?t:"")+"]",i,n,r)})
else if(n||"object"!==K.type(t))r(e,t)
else for(i in t)W(e+"["+i+"]",t[i],n,r)}function $(e){return K.isWindow(e)?e:9===e.nodeType&&e.defaultView}var I=[],B=I.slice,_=I.concat,z=I.push,X=I.indexOf,U={},V=U.toString,Y=U.hasOwnProperty,G={},Q=e.document,J="2.1.4",K=function(e,t){return new K.fn.init(e,t)},Z=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,ee=/^-ms-/,te=/-([\da-z])/gi,ne=function(e,t){return t.toUpperCase()}
K.fn=K.prototype={jquery:J,constructor:K,selector:"",length:0,toArray:function(){return B.call(this)},get:function(e){return null!=e?0>e?this[e+this.length]:this[e]:B.call(this)},pushStack:function(e){var t=K.merge(this.constructor(),e)
return t.prevObject=this,t.context=this.context,t},each:function(e,t){return K.each(this,e,t)},map:function(e){return this.pushStack(K.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(B.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0)
return this.pushStack(n>=0&&t>n?[this[n]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:z,sort:I.sort,splice:I.splice},K.extend=K.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1
for("boolean"==typeof s&&(l=s,s=arguments[a]||{},a++),"object"==typeof s||K.isFunction(s)||(s={}),a===u&&(s=this,a--);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(K.isPlainObject(r)||(i=K.isArray(r)))?(i?(i=!1,o=n&&K.isArray(n)?n:[]):o=n&&K.isPlainObject(n)?n:{},s[t]=K.extend(l,o,r)):void 0!==r&&(s[t]=r))
return s},K.extend({expando:"jQuery"+(J+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return"function"===K.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!K.isArray(e)&&e-parseFloat(e)+1>=0},isPlainObject:function(e){return"object"===K.type(e)&&!e.nodeType&&!K.isWindow(e)&&!(e.constructor&&!Y.call(e.constructor.prototype,"isPrototypeOf"))},isEmptyObject:function(e){var t
for(t in e)return!1
return!0},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?U[V.call(e)]||"object":typeof e},globalEval:function(e){var t,n=eval;(e=K.trim(e))&&(1===e.indexOf("use strict")?(t=Q.createElement("script"),t.text=e,Q.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(ee,"ms-").replace(te,ne)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,r){var i=0,o=e.length,s=n(e)
if(r){if(s)for(;o>i&&!1!==t.apply(e[i],r);i++);else for(i in e)if(!1===t.apply(e[i],r))break}else if(s)for(;o>i&&!1!==t.call(e[i],i,e[i]);i++);else for(i in e)if(!1===t.call(e[i],i,e[i]))break
return e},trim:function(e){return null==e?"":(e+"").replace(Z,"")},makeArray:function(e,t){var r=t||[]
return null!=e&&(n(Object(e))?K.merge(r,"string"==typeof e?[e]:e):z.call(r,e)),r},inArray:function(e,t,n){return null==t?-1:X.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;n>r;r++)e[i++]=t[r]
return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,s=!n;o>i;i++)!t(e[i],i)!==s&&r.push(e[i])
return r},map:function(e,t,r){var i,o=0,s=e.length,a=[]
if(n(e))for(;s>o;o++)null!=(i=t(e[o],o,r))&&a.push(i)
else for(o in e)null!=(i=t(e[o],o,r))&&a.push(i)
return _.apply([],a)},guid:1,proxy:function(e,t){var n,r,i
return"string"==typeof t&&(n=e[t],t=e,e=n),K.isFunction(e)?(r=B.call(arguments,2),i=function(){return e.apply(t||this,r.concat(B.call(arguments)))},i.guid=e.guid=e.guid||K.guid++,i):void 0},now:Date.now,support:G}),K.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){U["[object "+t+"]"]=t.toLowerCase()})
var re=function(e){function t(e,t,n,r){var i,o,s,a,l,f,p,d,h,g
if((t?t.ownerDocument||t:M)!==A&&j(t),t=t||A,n=n||[],a=t.nodeType,"string"!=typeof e||!e||1!==a&&9!==a&&11!==a)return n
if(!r&&q){if(11!==a&&(i=ve.exec(e)))if(s=i[1]){if(9===a){if(!(o=t.getElementById(s))||!o.parentNode)return n
if(o.id===s)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(s))&&P(t,o)&&o.id===s)return n.push(o),n}else{if(i[2])return Q.apply(n,t.getElementsByTagName(e)),n
if((s=i[3])&&x.getElementsByClassName)return Q.apply(n,t.getElementsByClassName(s)),n}if(x.qsa&&(!H||!H.test(e))){if(d=p=R,h=t,g=1!==a&&e,1===a&&"object"!==t.nodeName.toLowerCase()){for(f=C(e),(p=t.getAttribute("id"))?d=p.replace(ye,"\\$&"):t.setAttribute("id",d),d="[id='"+d+"'] ",l=f.length;l--;)f[l]=d+c(f[l])
h=me.test(e)&&u(t.parentNode)||t,g=f.join(",")}if(g)try{return Q.apply(n,h.querySelectorAll(g)),n}catch(e){}finally{p||t.removeAttribute("id")}}}return k(e.replace(se,"$1"),t,n,r)}function n(){function e(n,r){return t.push(n+" ")>b.cacheLength&&delete e[t.shift()],e[n+" "]=r}var t=[]
return e}function r(e){return e[R]=!0,e}function i(e){var t=A.createElement("div")
try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function o(e,t){for(var n=e.split("|"),r=e.length;r--;)b.attrHandle[n[r]]=t}function s(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||X)-(~e.sourceIndex||X)
if(r)return r
if(n)for(;n=n.nextSibling;)if(n===t)return-1
return e?1:-1}function a(e){return r(function(t){return t=+t,r(function(n,r){for(var i,o=e([],n.length,t),s=o.length;s--;)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}function u(e){return e&&void 0!==e.getElementsByTagName&&e}function l(){}function c(e){for(var t=0,n=e.length,r="";n>t;t++)r+=e[t].value
return r}function f(e,t,n){var r=t.dir,i=n&&"parentNode"===r,o=$++
return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||i)return e(t,n,o)}:function(t,n,s){var a,u,l=[W,o]
if(s){for(;t=t[r];)if((1===t.nodeType||i)&&e(t,n,s))return!0}else for(;t=t[r];)if(1===t.nodeType||i){if(u=t[R]||(t[R]={}),(a=u[r])&&a[0]===W&&a[1]===o)return l[2]=a[2]
if(u[r]=l,l[2]=e(t,n,s))return!0}}}function p(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1
return!0}:e[0]}function d(e,n,r){for(var i=0,o=n.length;o>i;i++)t(e,n[i],r)
return r}function h(e,t,n,r,i){for(var o,s=[],a=0,u=e.length,l=null!=t;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a))
return s}function g(e,t,n,i,o,s){return i&&!i[R]&&(i=g(i)),o&&!o[R]&&(o=g(o,s)),r(function(r,s,a,u){var l,c,f,p=[],g=[],v=s.length,m=r||d(t||"*",a.nodeType?[a]:a,[]),y=!e||!r&&t?m:h(m,p,e,a,u),x=n?o||(r?e:v||i)?[]:s:y
if(n&&n(y,x,a,u),i)for(l=h(x,g),i(l,[],a,u),c=l.length;c--;)(f=l[c])&&(x[g[c]]=!(y[g[c]]=f))
if(r){if(o||e){if(o){for(l=[],c=x.length;c--;)(f=x[c])&&l.push(y[c]=f)
o(null,x=[],l,u)}for(c=x.length;c--;)(f=x[c])&&(l=o?K(r,f):p[c])>-1&&(r[l]=!(s[l]=f))}}else x=h(x===s?x.splice(v,x.length):x),o?o(null,s,x,u):Q.apply(s,x)})}function v(e){for(var t,n,r,i=e.length,o=b.relative[e[0].type],s=o||b.relative[" "],a=o?1:0,u=f(function(e){return e===t},s,!0),l=f(function(e){return K(t,e)>-1},s,!0),d=[function(e,n,r){var i=!o&&(r||n!==E)||((t=n).nodeType?u(e,n,r):l(e,n,r))
return t=null,i}];i>a;a++)if(n=b.relative[e[a].type])d=[f(p(d),n)]
else{if((n=b.filter[e[a].type].apply(null,e[a].matches))[R]){for(r=++a;i>r&&!b.relative[e[r].type];r++);return g(a>1&&p(d),a>1&&c(e.slice(0,a-1).concat({value:" "===e[a-2].type?"*":""})).replace(se,"$1"),n,r>a&&v(e.slice(a,r)),i>r&&v(e=e.slice(r)),i>r&&c(e))}d.push(n)}return p(d)}function m(e,n){var i=n.length>0,o=e.length>0,s=function(r,s,a,u,l){var c,f,p,d=0,g="0",v=r&&[],m=[],y=E,x=r||o&&b.find.TAG("*",l),w=W+=null==y?1:Math.random()||.1,T=x.length
for(l&&(E=s!==A&&s);g!==T&&null!=(c=x[g]);g++){if(o&&c){for(f=0;p=e[f++];)if(p(c,s,a)){u.push(c)
break}l&&(W=w)}i&&((c=!p&&c)&&d--,r&&v.push(c))}if(d+=g,i&&g!==d){for(f=0;p=n[f++];)p(v,m,s,a)
if(r){if(d>0)for(;g--;)v[g]||m[g]||(m[g]=Y.call(u))
m=h(m)}Q.apply(u,m),l&&!r&&m.length>0&&d+n.length>1&&t.uniqueSort(u)}return l&&(W=w,E=y),v}
return i?r(s):s}var y,x,b,w,T,C,N,k,E,S,D,j,A,L,q,H,O,F,P,R="sizzle"+1*new Date,M=e.document,W=0,$=0,I=n(),B=n(),_=n(),z=function(e,t){return e===t&&(D=!0),0},X=1<<31,U={}.hasOwnProperty,V=[],Y=V.pop,G=V.push,Q=V.push,J=V.slice,K=function(e,t){for(var n=0,r=e.length;r>n;n++)if(e[n]===t)return n
return-1},Z="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",ee="[\\x20\\t\\r\\n\\f]",te="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ne=te.replace("w","w#"),re="\\["+ee+"*("+te+")(?:"+ee+"*([*^$|!~]?=)"+ee+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+ne+"))|)"+ee+"*\\]",ie=":("+te+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+re+")*)|.*)\\)|)",oe=new RegExp(ee+"+","g"),se=new RegExp("^"+ee+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ee+"+$","g"),ae=new RegExp("^"+ee+"*,"+ee+"*"),ue=new RegExp("^"+ee+"*([>+~]|"+ee+")"+ee+"*"),le=new RegExp("="+ee+"*([^\\]'\"]*?)"+ee+"*\\]","g"),ce=new RegExp(ie),fe=new RegExp("^"+ne+"$"),pe={ID:new RegExp("^#("+te+")"),CLASS:new RegExp("^\\.("+te+")"),TAG:new RegExp("^("+te.replace("w","w*")+")"),ATTR:new RegExp("^"+re),PSEUDO:new RegExp("^"+ie),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ee+"*(even|odd|(([+-]|)(\\d*)n|)"+ee+"*(?:([+-]|)"+ee+"*(\\d+)|))"+ee+"*\\)|)","i"),bool:new RegExp("^(?:"+Z+")$","i"),needsContext:new RegExp("^"+ee+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ee+"*((?:-\\d)?\\d*)"+ee+"*\\)|)(?=[^-]|$)","i")},de=/^(?:input|select|textarea|button)$/i,he=/^h\d$/i,ge=/^[^{]+\{\s*\[native \w/,ve=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,me=/[+~]/,ye=/'|\\/g,xe=new RegExp("\\\\([\\da-f]{1,6}"+ee+"?|("+ee+")|.)","ig"),be=function(e,t,n){var r="0x"+t-65536
return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},we=function(){j()}
try{Q.apply(V=J.call(M.childNodes),M.childNodes),V[M.childNodes.length].nodeType}catch(e){Q={apply:V.length?function(e,t){G.apply(e,J.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}x=t.support={},T=t.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement
return!!t&&"HTML"!==t.nodeName},j=t.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:M
return r!==A&&9===r.nodeType&&r.documentElement?(A=r,L=r.documentElement,(n=r.defaultView)&&n!==n.top&&(n.addEventListener?n.addEventListener("unload",we,!1):n.attachEvent&&n.attachEvent("onunload",we)),q=!T(r),x.attributes=i(function(e){return e.className="i",!e.getAttribute("className")}),x.getElementsByTagName=i(function(e){return e.appendChild(r.createComment("")),!e.getElementsByTagName("*").length}),x.getElementsByClassName=ge.test(r.getElementsByClassName),x.getById=i(function(e){return L.appendChild(e).id=R,!r.getElementsByName||!r.getElementsByName(R).length}),x.getById?(b.find.ID=function(e,t){if(void 0!==t.getElementById&&q){var n=t.getElementById(e)
return n&&n.parentNode?[n]:[]}},b.filter.ID=function(e){var t=e.replace(xe,be)
return function(e){return e.getAttribute("id")===t}}):(delete b.find.ID,b.filter.ID=function(e){var t=e.replace(xe,be)
return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id")
return n&&n.value===t}}),b.find.TAG=x.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):x.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e)
if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n)
return r}return o},b.find.CLASS=x.getElementsByClassName&&function(e,t){return q?t.getElementsByClassName(e):void 0},O=[],H=[],(x.qsa=ge.test(r.querySelectorAll))&&(i(function(e){L.appendChild(e).innerHTML="<a id='"+R+"'></a><select id='"+R+"-\f]' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&H.push("[*^$]="+ee+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||H.push("\\["+ee+"*(?:value|"+Z+")"),e.querySelectorAll("[id~="+R+"-]").length||H.push("~="),e.querySelectorAll(":checked").length||H.push(":checked"),e.querySelectorAll("a#"+R+"+*").length||H.push(".#.+[+~]")}),i(function(e){var t=r.createElement("input")
t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&H.push("name"+ee+"*[*^$|!~]?="),e.querySelectorAll(":enabled").length||H.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),H.push(",.*:")})),(x.matchesSelector=ge.test(F=L.matches||L.webkitMatchesSelector||L.mozMatchesSelector||L.oMatchesSelector||L.msMatchesSelector))&&i(function(e){x.disconnectedMatch=F.call(e,"div"),F.call(e,"[s!='']:x"),O.push("!=",ie)}),H=H.length&&new RegExp(H.join("|")),O=O.length&&new RegExp(O.join("|")),t=ge.test(L.compareDocumentPosition),P=t||ge.test(L.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode
return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0
return!1},z=t?function(e,t){if(e===t)return D=!0,0
var n=!e.compareDocumentPosition-!t.compareDocumentPosition
return n||(1&(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!x.sortDetached&&t.compareDocumentPosition(e)===n?e===r||e.ownerDocument===M&&P(M,e)?-1:t===r||t.ownerDocument===M&&P(M,t)?1:S?K(S,e)-K(S,t):0:4&n?-1:1)}:function(e,t){if(e===t)return D=!0,0
var n,i=0,o=e.parentNode,a=t.parentNode,u=[e],l=[t]
if(!o||!a)return e===r?-1:t===r?1:o?-1:a?1:S?K(S,e)-K(S,t):0
if(o===a)return s(e,t)
for(n=e;n=n.parentNode;)u.unshift(n)
for(n=t;n=n.parentNode;)l.unshift(n)
for(;u[i]===l[i];)i++
return i?s(u[i],l[i]):u[i]===M?-1:l[i]===M?1:0},r):A},t.matches=function(e,n){return t(e,null,null,n)},t.matchesSelector=function(e,n){if((e.ownerDocument||e)!==A&&j(e),n=n.replace(le,"='$1']"),!(!x.matchesSelector||!q||O&&O.test(n)||H&&H.test(n)))try{var r=F.call(e,n)
if(r||x.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return t(n,A,null,[e]).length>0},t.contains=function(e,t){return(e.ownerDocument||e)!==A&&j(e),P(e,t)},t.attr=function(e,t){(e.ownerDocument||e)!==A&&j(e)
var n=b.attrHandle[t.toLowerCase()],r=n&&U.call(b.attrHandle,t.toLowerCase())?n(e,t,!q):void 0
return void 0!==r?r:x.attributes||!q?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},t.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},t.uniqueSort=function(e){var t,n=[],r=0,i=0
if(D=!x.detectDuplicates,S=!x.sortStable&&e.slice(0),e.sort(z),D){for(;t=e[i++];)t===e[i]&&(r=n.push(i))
for(;r--;)e.splice(n[r],1)}return S=null,e},w=t.getText=function(e){var t,n="",r=0,i=e.nodeType
if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent
for(e=e.firstChild;e;e=e.nextSibling)n+=w(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=w(t)
return n},(b=t.selectors={cacheLength:50,createPseudo:r,match:pe,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(xe,be),e[3]=(e[3]||e[4]||e[5]||"").replace(xe,be),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&t.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2]
return pe.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&ce.test(n)&&(t=C(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(xe,be).toLowerCase()
return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=I[e+" "]
return t||(t=new RegExp("(^|"+ee+")"+e+"("+ee+"|$)"))&&I(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,n,r){return function(i){var o=t.attr(i,e)
return null==o?"!="===n:!n||(o+="","="===n?o===r:"!="===n?o!==r:"^="===n?r&&0===o.indexOf(r):"*="===n?r&&o.indexOf(r)>-1:"$="===n?r&&o.slice(-r.length)===r:"~="===n?(" "+o.replace(oe," ")+" ").indexOf(r)>-1:"|="===n&&(o===r||o.slice(0,r.length+1)===r+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t
return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==s?"nextSibling":"previousSibling",v=t.parentNode,m=a&&t.nodeName.toLowerCase(),y=!u&&!a
if(v){if(o){for(;g;){for(f=t;f=f[g];)if(a?f.nodeName.toLowerCase()===m:1===f.nodeType)return!1
h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[s?v.firstChild:v.lastChild],s&&y){for(d=(l=(c=v[R]||(v[R]={}))[e]||[])[0]===W&&l[1],p=l[0]===W&&l[2],f=d&&v.childNodes[d];f=++d&&f&&f[g]||(p=d=0)||h.pop();)if(1===f.nodeType&&++p&&f===t){c[e]=[W,d,p]
break}}else if(y&&(l=(t[R]||(t[R]={}))[e])&&l[0]===W)p=l[1]
else for(;(f=++d&&f&&f[g]||(p=d=0)||h.pop())&&((a?f.nodeName.toLowerCase()!==m:1!==f.nodeType)||!++p||(y&&((f[R]||(f[R]={}))[e]=[W,p]),f!==t)););return(p-=i)===r||p%r==0&&p/r>=0}}},PSEUDO:function(e,n){var i,o=b.pseudos[e]||b.setFilters[e.toLowerCase()]||t.error("unsupported pseudo: "+e)
return o[R]?o(n):o.length>1?(i=[e,e,"",n],b.setFilters.hasOwnProperty(e.toLowerCase())?r(function(e,t){for(var r,i=o(e,n),s=i.length;s--;)r=K(e,i[s]),e[r]=!(t[r]=i[s])}):function(e){return o(e,0,i)}):o}},pseudos:{not:r(function(e){var t=[],n=[],i=N(e.replace(se,"$1"))
return i[R]?r(function(e,t,n,r){for(var o,s=i(e,null,r,[]),a=e.length;a--;)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop()}}),has:r(function(e){return function(n){return t(e,n).length>0}}),contains:r(function(e){return e=e.replace(xe,be),function(t){return(t.textContent||t.innerText||w(t)).indexOf(e)>-1}}),lang:r(function(e){return fe.test(e||"")||t.error("unsupported lang: "+e),e=e.replace(xe,be).toLowerCase(),function(t){var n
do{if(n=q?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType)
return!1}}),target:function(t){var n=e.location&&e.location.hash
return n&&n.slice(1)===t.id},root:function(e){return e===L},focus:function(e){return e===A.activeElement&&(!A.hasFocus||A.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return!1===e.disabled},disabled:function(e){return!0===e.disabled},checked:function(e){var t=e.nodeName.toLowerCase()
return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1
return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return he.test(e.nodeName)},input:function(e){return de.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase()
return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t
return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:a(function(){return[0]}),last:a(function(e,t){return[t-1]}),eq:a(function(e,t,n){return[0>n?n+t:n]}),even:a(function(e,t){for(var n=0;t>n;n+=2)e.push(n)
return e}),odd:a(function(e,t){for(var n=1;t>n;n+=2)e.push(n)
return e}),lt:a(function(e,t,n){for(var r=0>n?n+t:n;--r>=0;)e.push(r)
return e}),gt:a(function(e,t,n){for(var r=0>n?n+t:n;++r<t;)e.push(r)
return e})}}).pseudos.nth=b.pseudos.eq
for(y in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[y]=function(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}(y)
for(y in{submit:!0,reset:!0})b.pseudos[y]=function(e){return function(t){var n=t.nodeName.toLowerCase()
return("input"===n||"button"===n)&&t.type===e}}(y)
return l.prototype=b.filters=b.pseudos,b.setFilters=new l,C=t.tokenize=function(e,n){var r,i,o,s,a,u,l,c=B[e+" "]
if(c)return n?0:c.slice(0)
for(a=e,u=[],l=b.preFilter;a;){(!r||(i=ae.exec(a)))&&(i&&(a=a.slice(i[0].length)||a),u.push(o=[])),r=!1,(i=ue.exec(a))&&(r=i.shift(),o.push({value:r,type:i[0].replace(se," ")}),a=a.slice(r.length))
for(s in b.filter)!(i=pe[s].exec(a))||l[s]&&!(i=l[s](i))||(r=i.shift(),o.push({value:r,type:s,matches:i}),a=a.slice(r.length))
if(!r)break}return n?a.length:a?t.error(e):B(e,u).slice(0)},N=t.compile=function(e,t){var n,r=[],i=[],o=_[e+" "]
if(!o){for(t||(t=C(e)),n=t.length;n--;)(o=v(t[n]))[R]?r.push(o):i.push(o);(o=_(e,m(i,r))).selector=e}return o},k=t.select=function(e,t,n,r){var i,o,s,a,l,f="function"==typeof e&&e,p=!r&&C(e=f.selector||e)
if(n=n||[],1===p.length){if((o=p[0]=p[0].slice(0)).length>2&&"ID"===(s=o[0]).type&&x.getById&&9===t.nodeType&&q&&b.relative[o[1].type]){if(!(t=(b.find.ID(s.matches[0].replace(xe,be),t)||[])[0]))return n
f&&(t=t.parentNode),e=e.slice(o.shift().value.length)}for(i=pe.needsContext.test(e)?0:o.length;i--&&(s=o[i],!b.relative[a=s.type]);)if((l=b.find[a])&&(r=l(s.matches[0].replace(xe,be),me.test(o[0].type)&&u(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&c(o)))return Q.apply(n,r),n
break}}return(f||N(e,p))(r,t,!q,n,me.test(e)&&u(t.parentNode)||t),n},x.sortStable=R.split("").sort(z).join("")===R,x.detectDuplicates=!!D,j(),x.sortDetached=i(function(e){return 1&e.compareDocumentPosition(A.createElement("div"))}),i(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||o("type|href|height|width",function(e,t,n){return n?void 0:e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),x.attributes&&i(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||o("value",function(e,t,n){return n||"input"!==e.nodeName.toLowerCase()?void 0:e.defaultValue}),i(function(e){return null==e.getAttribute("disabled")})||o(Z,function(e,t,n){var r
return n?void 0:!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),t}(e)
K.find=re,K.expr=re.selectors,K.expr[":"]=K.expr.pseudos,K.unique=re.uniqueSort,K.text=re.getText,K.isXMLDoc=re.isXML,K.contains=re.contains
var ie=K.expr.match.needsContext,oe=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,se=/^.[^:#\[\.,]*$/
K.filter=function(e,t,n){var r=t[0]
return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?K.find.matchesSelector(r,e)?[r]:[]:K.find.matches(e,K.grep(t,function(e){return 1===e.nodeType}))},K.fn.extend({find:function(e){var t,n=this.length,r=[],i=this
if("string"!=typeof e)return this.pushStack(K(e).filter(function(){for(t=0;n>t;t++)if(K.contains(i[t],this))return!0}))
for(t=0;n>t;t++)K.find(e,i[t],r)
return r=this.pushStack(n>1?K.unique(r):r),r.selector=this.selector?this.selector+" "+e:e,r},filter:function(e){return this.pushStack(r(this,e||[],!1))},not:function(e){return this.pushStack(r(this,e||[],!0))},is:function(e){return!!r(this,"string"==typeof e&&ie.test(e)?K(e):e||[],!1).length}})
var ae,ue=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;(K.fn.init=function(e,t){var n,r
if(!e)return this
if("string"==typeof e){if(!(n="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:ue.exec(e))||!n[1]&&t)return!t||t.jquery?(t||ae).find(e):this.constructor(t).find(e)
if(n[1]){if(t=t instanceof K?t[0]:t,K.merge(this,K.parseHTML(n[1],t&&t.nodeType?t.ownerDocument||t:Q,!0)),oe.test(n[1])&&K.isPlainObject(t))for(n in t)K.isFunction(this[n])?this[n](t[n]):this.attr(n,t[n])
return this}return(r=Q.getElementById(n[2]))&&r.parentNode&&(this.length=1,this[0]=r),this.context=Q,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):K.isFunction(e)?void 0!==ae.ready?ae.ready(e):e(K):(void 0!==e.selector&&(this.selector=e.selector,this.context=e.context),K.makeArray(e,this))}).prototype=K.fn,ae=K(Q)
var le=/^(?:parents|prev(?:Until|All))/,ce={children:!0,contents:!0,next:!0,prev:!0}
K.extend({dir:function(e,t,n){for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(i&&K(e).is(n))break
r.push(e)}return r},sibling:function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e)
return n}}),K.fn.extend({has:function(e){var t=K(e,this),n=t.length
return this.filter(function(){for(var e=0;n>e;e++)if(K.contains(this,t[e]))return!0})},closest:function(e,t){for(var n,r=0,i=this.length,o=[],s=ie.test(e)||"string"!=typeof e?K(e,t||this.context):0;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(s?s.index(n)>-1:1===n.nodeType&&K.find.matchesSelector(n,e))){o.push(n)
break}return this.pushStack(o.length>1?K.unique(o):o)},index:function(e){return e?"string"==typeof e?X.call(K(e),this[0]):X.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(K.unique(K.merge(this.get(),K(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),K.each({parent:function(e){var t=e.parentNode
return t&&11!==t.nodeType?t:null},parents:function(e){return K.dir(e,"parentNode")},parentsUntil:function(e,t,n){return K.dir(e,"parentNode",n)},next:function(e){return i(e,"nextSibling")},prev:function(e){return i(e,"previousSibling")},nextAll:function(e){return K.dir(e,"nextSibling")},prevAll:function(e){return K.dir(e,"previousSibling")},nextUntil:function(e,t,n){return K.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return K.dir(e,"previousSibling",n)},siblings:function(e){return K.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return K.sibling(e.firstChild)},contents:function(e){return e.contentDocument||K.merge([],e.childNodes)}},function(e,t){K.fn[e]=function(n,r){var i=K.map(this,t,n)
return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=K.filter(r,i)),this.length>1&&(ce[e]||K.unique(i),le.test(e)&&i.reverse()),this.pushStack(i)}})
var fe=/\S+/g,pe={}
K.Callbacks=function(e){var t,n,r,i,s,a,u=[],l=!(e="string"==typeof e?pe[e]||o(e):K.extend({},e)).once&&[],c=function(o){for(t=e.memory&&o,n=!0,a=i||0,i=0,s=u.length,r=!0;u&&s>a;a++)if(!1===u[a].apply(o[0],o[1])&&e.stopOnFalse){t=!1
break}r=!1,u&&(l?l.length&&c(l.shift()):t?u=[]:f.disable())},f={add:function(){if(u){var n=u.length
!function t(n){K.each(n,function(n,r){var i=K.type(r)
"function"===i?e.unique&&f.has(r)||u.push(r):r&&r.length&&"string"!==i&&t(r)})}(arguments),r?s=u.length:t&&(i=n,c(t))}return this},remove:function(){return u&&K.each(arguments,function(e,t){for(var n;(n=K.inArray(t,u,n))>-1;)u.splice(n,1),r&&(s>=n&&s--,a>=n&&a--)}),this},has:function(e){return e?K.inArray(e,u)>-1:!(!u||!u.length)},empty:function(){return u=[],s=0,this},disable:function(){return u=l=t=void 0,this},disabled:function(){return!u},lock:function(){return l=void 0,t||f.disable(),this},locked:function(){return!l},fireWith:function(e,t){return!u||n&&!l||(t=t||[],t=[e,t.slice?t.slice():t],r?l.push(t):c(t)),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!n}}
return f},K.extend({Deferred:function(e){var t=[["resolve","done",K.Callbacks("once memory"),"resolved"],["reject","fail",K.Callbacks("once memory"),"rejected"],["notify","progress",K.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments
return K.Deferred(function(n){K.each(t,function(t,o){var s=K.isFunction(e[t])&&e[t]
i[o[1]](function(){var e=s&&s.apply(this,arguments)
e&&K.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[o[0]+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?K.extend(e,r):r}},i={}
return r.pipe=r.then,K.each(t,function(e,o){var s=o[2],a=o[3]
r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t,n,r,i=0,o=B.call(arguments),s=o.length,a=1!==s||e&&K.isFunction(e.promise)?s:0,u=1===a?e:K.Deferred(),l=function(e,n,r){return function(i){n[e]=this,r[e]=arguments.length>1?B.call(arguments):i,r===t?u.notifyWith(n,r):--a||u.resolveWith(n,r)}}
if(s>1)for(t=new Array(s),n=new Array(s),r=new Array(s);s>i;i++)o[i]&&K.isFunction(o[i].promise)?o[i].promise().done(l(i,r,o)).fail(u.reject).progress(l(i,n,t)):--a
return a||u.resolveWith(r,o),u.promise()}})
var de
K.fn.ready=function(e){return K.ready.promise().done(e),this},K.extend({isReady:!1,readyWait:1,holdReady:function(e){e?K.readyWait++:K.ready(!0)},ready:function(e){(!0===e?--K.readyWait:K.isReady)||(K.isReady=!0,!0!==e&&--K.readyWait>0||(de.resolveWith(Q,[K]),K.fn.triggerHandler&&(K(Q).triggerHandler("ready"),K(Q).off("ready"))))}}),K.ready.promise=function(t){return de||(de=K.Deferred(),"complete"===Q.readyState?setTimeout(K.ready):(Q.addEventListener("DOMContentLoaded",s,!1),e.addEventListener("load",s,!1))),de.promise(t)},K.ready.promise()
var he=K.access=function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n
if("object"===K.type(n)){i=!0
for(a in n)K.access(e,t,a,n[a],!0,o,s)}else if(void 0!==r&&(i=!0,K.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(K(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)))
return i?e:l?t.call(e):u?t(e[0],n):o}
K.acceptData=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType},a.uid=1,a.accepts=K.acceptData,a.prototype={key:function(e){if(!a.accepts(e))return 0
var t={},n=e[this.expando]
if(!n){n=a.uid++
try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,K.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i]
if("string"==typeof t)o[t]=n
else if(K.isEmptyObject(o))K.extend(this.cache[i],t)
else for(r in t)o[r]=t[r]
return o},get:function(e,t){var n=this.cache[this.key(e)]
return void 0===t?n:n[t]},access:function(e,t,n){var r
return void 0===t||t&&"string"==typeof t&&void 0===n?void 0!==(r=this.get(e,t))?r:this.get(e,K.camelCase(t)):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r,i,o=this.key(e),s=this.cache[o]
if(void 0===t)this.cache[o]={}
else{K.isArray(t)?r=t.concat(t.map(K.camelCase)):(i=K.camelCase(t),t in s?r=[t,i]:(r=i,r=r in s?[r]:r.match(fe)||[])),n=r.length
for(;n--;)delete s[r[n]]}},hasData:function(e){return!K.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){e[this.expando]&&delete this.cache[e[this.expando]]}}
var ge=new a,ve=new a,me=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ye=/([A-Z])/g
K.extend({hasData:function(e){return ve.hasData(e)||ge.hasData(e)},data:function(e,t,n){return ve.access(e,t,n)},removeData:function(e,t){ve.remove(e,t)},_data:function(e,t,n){return ge.access(e,t,n)},_removeData:function(e,t){ge.remove(e,t)}}),K.fn.extend({data:function(e,t){var n,r,i,o=this[0],s=o&&o.attributes
if(void 0===e){if(this.length&&(i=ve.get(o),1===o.nodeType&&!ge.get(o,"hasDataAttrs"))){for(n=s.length;n--;)s[n]&&0===(r=s[n].name).indexOf("data-")&&(r=K.camelCase(r.slice(5)),u(o,r,i[r]))
ge.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){ve.set(this,e)}):he(this,function(t){var n,r=K.camelCase(e)
if(o&&void 0===t){if(void 0!==(n=ve.get(o,e)))return n
if(void 0!==(n=ve.get(o,r)))return n
if(void 0!==(n=u(o,r,void 0)))return n}else this.each(function(){var n=ve.get(this,r)
ve.set(this,r,t),-1!==e.indexOf("-")&&void 0!==n&&ve.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){ve.remove(this,e)})}}),K.extend({queue:function(e,t,n){var r
return e?(t=(t||"fx")+"queue",r=ge.get(e,t),n&&(!r||K.isArray(n)?r=ge.access(e,t,K.makeArray(n)):r.push(n)),r||[]):void 0},dequeue:function(e,t){t=t||"fx"
var n=K.queue(e,t),r=n.length,i=n.shift(),o=K._queueHooks(e,t)
"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){K.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks"
return ge.get(e,n)||ge.access(e,n,{empty:K.Callbacks("once memory").add(function(){ge.remove(e,[t+"queue",n])})})}}),K.fn.extend({queue:function(e,t){var n=2
return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?K.queue(this[0],e):void 0===t?this:this.each(function(){var n=K.queue(this,e,t)
K._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&K.dequeue(this,e)})},dequeue:function(e){return this.each(function(){K.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=K.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])}
for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";s--;)(n=ge.get(o[s],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(a))
return a(),i.promise(t)}})
var xe=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,be=["Top","Right","Bottom","Left"],we=function(e,t){return e=t||e,"none"===K.css(e,"display")||!K.contains(e.ownerDocument,e)},Te=/^(?:checkbox|radio)$/i
!function(){var e=Q.createDocumentFragment().appendChild(Q.createElement("div")),t=Q.createElement("input")
t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),G.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",G.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}()
var Ce="undefined"
G.focusinBubbles="onfocusin"in e
var Ne=/^key/,ke=/^(?:mouse|pointer|contextmenu)|click/,Ee=/^(?:focusinfocus|focusoutblur)$/,Se=/^([^.]*)(?:\.(.+)|)$/
K.event={global:{},add:function(e,t,n,r,i){var o,s,a,u,l,c,f,p,d,h,g,v=ge.get(e)
if(v)for(n.handler&&(o=n,n=o.handler,i=o.selector),n.guid||(n.guid=K.guid++),(u=v.events)||(u=v.events={}),(s=v.handle)||(s=v.handle=function(t){return typeof K!==Ce&&K.event.triggered!==t.type?K.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(fe)||[""]).length;l--;)a=Se.exec(t[l])||[],d=g=a[1],h=(a[2]||"").split(".").sort(),d&&(f=K.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=K.event.special[d]||{},c=K.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&K.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||(p=u[d]=[],p.delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,s)||e.addEventListener&&e.addEventListener(d,s,!1)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),K.event.global[d]=!0)},remove:function(e,t,n,r,i){var o,s,a,u,l,c,f,p,d,h,g,v=ge.hasData(e)&&ge.get(e)
if(v&&(u=v.events)){for(l=(t=(t||"").match(fe)||[""]).length;l--;)if(a=Se.exec(t[l])||[],d=g=a[1],h=(a[2]||"").split(".").sort(),d){for(f=K.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],a=a[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=p.length;o--;)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c))
s&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||K.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)K.event.remove(e,d+t[l],n,r,!0)
K.isEmptyObject(u)&&(delete v.handle,ge.remove(e,"events"))}},trigger:function(t,n,r,i){var o,s,a,u,l,c,f,p=[r||Q],d=Y.call(t,"type")?t.type:t,h=Y.call(t,"namespace")?t.namespace.split("."):[]
if(s=a=r=r||Q,3!==r.nodeType&&8!==r.nodeType&&!Ee.test(d+K.event.triggered)&&(d.indexOf(".")>=0&&(h=d.split("."),d=h.shift(),h.sort()),l=d.indexOf(":")<0&&"on"+d,t=t[K.expando]?t:new K.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=h.join("."),t.namespace_re=t.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=r),n=null==n?[t]:K.makeArray(n,[t]),f=K.event.special[d]||{},i||!f.trigger||!1!==f.trigger.apply(r,n))){if(!i&&!f.noBubble&&!K.isWindow(r)){for(u=f.delegateType||d,Ee.test(u+d)||(s=s.parentNode);s;s=s.parentNode)p.push(s),a=s
a===(r.ownerDocument||Q)&&p.push(a.defaultView||a.parentWindow||e)}for(o=0;(s=p[o++])&&!t.isPropagationStopped();)t.type=o>1?u:f.bindType||d,(c=(ge.get(s,"events")||{})[t.type]&&ge.get(s,"handle"))&&c.apply(s,n),(c=l&&s[l])&&c.apply&&K.acceptData(s)&&(t.result=c.apply(s,n),!1===t.result&&t.preventDefault())
return t.type=d,i||t.isDefaultPrevented()||f._default&&!1!==f._default.apply(p.pop(),n)||!K.acceptData(r)||l&&K.isFunction(r[d])&&!K.isWindow(r)&&((a=r[l])&&(r[l]=null),K.event.triggered=d,r[d](),K.event.triggered=void 0,a&&(r[l]=a)),t.result}},dispatch:function(e){e=K.event.fix(e)
var t,n,r,i,o,s=[],a=B.call(arguments),u=(ge.get(this,"events")||{})[e.type]||[],l=K.event.special[e.type]||{}
if(a[0]=e,e.delegateTarget=this,!l.preDispatch||!1!==l.preDispatch.call(this,e)){for(s=K.event.handlers.call(this,e,u),t=0;(i=s[t++])&&!e.isPropagationStopped();)for(e.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!e.isImmediatePropagationStopped();)(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,void 0!==(r=((K.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a))&&!1===(e.result=r)&&(e.preventDefault(),e.stopPropagation()))
return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target
if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(!0!==u.disabled||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",void 0===r[i]&&(r[i]=o.needsContext?K(i,this).index(u)>=0:K.find(i,this,null,[u]).length),r[i]&&r.push(o)
r.length&&s.push({elem:u,handlers:r})}return a<t.length&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,o=t.button
return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||Q,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||void 0===o||(e.which=1&o?1:2&o?3:4&o?2:0),e}},fix:function(e){if(e[K.expando])return e
var t,n,r,i=e.type,o=e,s=this.fixHooks[i]
for(s||(this.fixHooks[i]=s=ke.test(i)?this.mouseHooks:Ne.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new K.Event(o),t=r.length;t--;)n=r[t],e[n]=o[n]
return e.target||(e.target=Q),3===e.target.nodeType&&(e.target=e.target.parentNode),s.filter?s.filter(e,o):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==f()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===f()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&K.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(e){return K.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=K.extend(new K.Event,n,{type:e,isSimulated:!0,originalEvent:{}})
r?K.event.trigger(i,null,t):K.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},K.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},K.Event=function(e,t){return this instanceof K.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?l:c):this.type=e,t&&K.extend(this,t),this.timeStamp=e&&e.timeStamp||K.now(),void(this[K.expando]=!0)):new K.Event(e,t)},K.Event.prototype={isDefaultPrevented:c,isPropagationStopped:c,isImmediatePropagationStopped:c,preventDefault:function(){var e=this.originalEvent
this.isDefaultPrevented=l,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent
this.isPropagationStopped=l,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent
this.isImmediatePropagationStopped=l,e&&e.stopImmediatePropagation&&e.stopImmediatePropagation(),this.stopPropagation()}},K.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){K.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj
return(!i||i!==r&&!K.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),G.focusinBubbles||K.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){K.event.simulate(t,e.target,K.event.fix(e),!0)}
K.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=ge.access(r,t)
i||r.addEventListener(e,n,!0),ge.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=ge.access(r,t)-1
i?ge.access(r,t,i):(r.removeEventListener(e,n,!0),ge.remove(r,t))}}}),K.fn.extend({on:function(e,t,n,r,i){var o,s
if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=void 0)
for(s in e)this.on(s,t,n,e[s],i)
return this}if(null==n&&null==r?(r=t,n=t=void 0):null==r&&("string"==typeof t?(r=n,n=void 0):(r=n,n=t,t=void 0)),!1===r)r=c
else if(!r)return this
return 1===i&&(o=r,r=function(e){return K().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=K.guid++)),this.each(function(){K.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i
if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,K(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this
if("object"==typeof e){for(i in e)this.off(i,t,e[i])
return this}return(!1===t||"function"==typeof t)&&(n=t,t=void 0),!1===n&&(n=c),this.each(function(){K.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){K.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0]
return n?K.event.trigger(e,t,n,!0):void 0}})
var De=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,je=/<([\w:]+)/,Ae=/<|&#?\w+;/,Le=/<(?:script|style|link)/i,qe=/checked\s*(?:[^=]|=\s*.checked.)/i,He=/^$|\/(?:java|ecma)script/i,Oe=/^true\/(.*)/,Fe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,Pe={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]}
Pe.optgroup=Pe.option,Pe.tbody=Pe.tfoot=Pe.colgroup=Pe.caption=Pe.thead,Pe.th=Pe.td,K.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=K.contains(e.ownerDocument,e)
if(!(G.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||K.isXMLDoc(e)))for(s=m(a),o=m(e),r=0,i=o.length;i>r;r++)y(o[r],s[r])
if(t)if(n)for(o=o||m(e),s=s||m(a),r=0,i=o.length;i>r;r++)v(o[r],s[r])
else v(e,a)
return(s=m(a,"script")).length>0&&g(s,!u&&m(e,"script")),a},buildFragment:function(e,t,n,r){for(var i,o,s,a,u,l,c=t.createDocumentFragment(),f=[],p=0,d=e.length;d>p;p++)if((i=e[p])||0===i)if("object"===K.type(i))K.merge(f,i.nodeType?[i]:i)
else if(Ae.test(i)){for(o=o||c.appendChild(t.createElement("div")),s=(je.exec(i)||["",""])[1].toLowerCase(),a=Pe[s]||Pe._default,o.innerHTML=a[1]+i.replace(De,"<$1></$2>")+a[2],l=a[0];l--;)o=o.lastChild
K.merge(f,o.childNodes),(o=c.firstChild).textContent=""}else f.push(t.createTextNode(i))
for(c.textContent="",p=0;i=f[p++];)if((!r||-1===K.inArray(i,r))&&(u=K.contains(i.ownerDocument,i),o=m(c.appendChild(i),"script"),u&&g(o),n))for(l=0;i=o[l++];)He.test(i.type||"")&&n.push(i)
return c},cleanData:function(e){for(var t,n,r,i,o=K.event.special,s=0;void 0!==(n=e[s]);s++){if(K.acceptData(n)&&(i=n[ge.expando])&&(t=ge.cache[i])){if(t.events)for(r in t.events)o[r]?K.event.remove(n,r):K.removeEvent(n,r,t.handle)
ge.cache[i]&&delete ge.cache[i]}delete ve.cache[n[ve.expando]]}}}),K.fn.extend({text:function(e){return he(this,function(e){return void 0===e?K.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=e)})},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||p(this,e).appendChild(e)})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=p(this,e)
t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){for(var n,r=e?K.filter(e,this):this,i=0;null!=(n=r[i]);i++)t||1!==n.nodeType||K.cleanData(m(n)),n.parentNode&&(t&&K.contains(n.ownerDocument,n)&&g(m(n,"script")),n.parentNode.removeChild(n))
return this},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(K.cleanData(m(e,!1)),e.textContent="")
return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return K.clone(this,e,t)})},html:function(e){return he(this,function(e){var t=this[0]||{},n=0,r=this.length
if(void 0===e&&1===t.nodeType)return t.innerHTML
if("string"==typeof e&&!Le.test(e)&&!Pe[(je.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(De,"<$1></$2>")
try{for(;r>n;n++)1===(t=this[n]||{}).nodeType&&(K.cleanData(m(t,!1)),t.innerHTML=e)
t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=arguments[0]
return this.domManip(arguments,function(t){e=this.parentNode,K.cleanData(m(this)),e&&e.replaceChild(t,this)}),e&&(e.length||e.nodeType)?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t){e=_.apply([],e)
var n,r,i,o,s,a,u=0,l=this.length,c=this,f=l-1,p=e[0],g=K.isFunction(p)
if(g||l>1&&"string"==typeof p&&!G.checkClone&&qe.test(p))return this.each(function(n){var r=c.eq(n)
g&&(e[0]=p.call(this,n,r.html())),r.domManip(e,t)})
if(l&&(n=K.buildFragment(e,this[0].ownerDocument,!1,this),r=n.firstChild,1===n.childNodes.length&&(n=r),r)){for(o=(i=K.map(m(n,"script"),d)).length;l>u;u++)s=n,u!==f&&(s=K.clone(s,!0,!0),o&&K.merge(i,m(s,"script"))),t.call(this[u],s,u)
if(o)for(a=i[i.length-1].ownerDocument,K.map(i,h),u=0;o>u;u++)s=i[u],He.test(s.type||"")&&!ge.access(s,"globalEval")&&K.contains(a,s)&&(s.src?K._evalUrl&&K._evalUrl(s.src):K.globalEval(s.textContent.replace(Fe,"")))}return this}}),K.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){K.fn[e]=function(e){for(var n,r=[],i=K(e),o=i.length-1,s=0;o>=s;s++)n=s===o?this:this.clone(!0),K(i[s])[t](n),z.apply(r,n.get())
return this.pushStack(r)}})
var Re,Me={},We=/^margin/,$e=new RegExp("^("+xe+")(?!px)[a-z%]+$","i"),Ie=function(t){return t.ownerDocument.defaultView.opener?t.ownerDocument.defaultView.getComputedStyle(t,null):e.getComputedStyle(t,null)}
!function(){var t,n,r=Q.documentElement,i=Q.createElement("div"),o=Q.createElement("div")
if(o.style){o.style.backgroundClip="content-box",o.cloneNode(!0).style.backgroundClip="",G.clearCloneStyle="content-box"===o.style.backgroundClip,i.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",i.appendChild(o)
function s(){o.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",o.innerHTML="",r.appendChild(i)
var s=e.getComputedStyle(o,null)
t="1%"!==s.top,n="4px"===s.width,r.removeChild(i)}e.getComputedStyle&&K.extend(G,{pixelPosition:function(){return s(),t},boxSizingReliable:function(){return null==n&&s(),n},reliableMarginRight:function(){var t,n=o.appendChild(Q.createElement("div"))
return n.style.cssText=o.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",n.style.marginRight=n.style.width="0",o.style.width="1px",r.appendChild(i),t=!parseFloat(e.getComputedStyle(n,null).marginRight),r.removeChild(i),o.removeChild(n),t}})}}(),K.swap=function(e,t,n,r){var i,o,s={}
for(o in t)s[o]=e.style[o],e.style[o]=t[o]
i=n.apply(e,r||[])
for(o in t)e.style[o]=s[o]
return i}
var Be=/^(none|table(?!-c[ea]).+)/,_e=new RegExp("^("+xe+")(.*)$","i"),ze=new RegExp("^([+-])=("+xe+")","i"),Xe={position:"absolute",visibility:"hidden",display:"block"},Ue={letterSpacing:"0",fontWeight:"400"},Ve=["Webkit","O","Moz","ms"]
K.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=w(e,"opacity")
return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{float:"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=K.camelCase(t),u=e.style
return t=K.cssProps[a]||(K.cssProps[a]=C(u,a)),s=K.cssHooks[t]||K.cssHooks[a],void 0===n?s&&"get"in s&&void 0!==(i=s.get(e,!1,r))?i:u[t]:("string"===(o=typeof n)&&(i=ze.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(K.css(e,t)),o="number"),void(null!=n&&n===n&&("number"!==o||K.cssNumber[a]||(n+="px"),G.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&void 0===(n=s.set(e,n,r))||(u[t]=n))))}},css:function(e,t,n,r){var i,o,s,a=K.camelCase(t)
return t=K.cssProps[a]||(K.cssProps[a]=C(e.style,a)),(s=K.cssHooks[t]||K.cssHooks[a])&&"get"in s&&(i=s.get(e,!0,n)),void 0===i&&(i=w(e,t,r)),"normal"===i&&t in Ue&&(i=Ue[t]),""===n||n?(o=parseFloat(i),!0===n||K.isNumeric(o)?o||0:i):i}}),K.each(["height","width"],function(e,t){K.cssHooks[t]={get:function(e,n,r){return n?Be.test(K.css(e,"display"))&&0===e.offsetWidth?K.swap(e,Xe,function(){return E(e,t,r)}):E(e,t,r):void 0},set:function(e,n,r){var i=r&&Ie(e)
return N(0,n,r?k(e,t,r,"border-box"===K.css(e,"boxSizing",!1,i),i):0)}}}),K.cssHooks.marginRight=T(G.reliableMarginRight,function(e,t){return t?K.swap(e,{display:"inline-block"},w,[e,"marginRight"]):void 0}),K.each({margin:"",padding:"",border:"Width"},function(e,t){K.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];4>r;r++)i[e+be[r]+t]=o[r]||o[r-2]||o[0]
return i}},We.test(e)||(K.cssHooks[e+t].set=N)}),K.fn.extend({css:function(e,t){return he(this,function(e,t,n){var r,i,o={},s=0
if(K.isArray(t)){for(r=Ie(e),i=t.length;i>s;s++)o[t[s]]=K.css(e,t[s],!1,r)
return o}return void 0!==n?K.style(e,t,n):K.css(e,t)},e,t,arguments.length>1)},show:function(){return S(this,!0)},hide:function(){return S(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){we(this)?K(this).show():K(this).hide()})}}),K.Tween=D,D.prototype={constructor:D,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(K.cssNumber[n]?"":"px")},cur:function(){var e=D.propHooks[this.prop]
return e&&e.get?e.get(this):D.propHooks._default.get(this)},run:function(e){var t,n=D.propHooks[this.prop]
return this.options.duration?this.pos=t=K.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):D.propHooks._default.set(this),this}},D.prototype.init.prototype=D.prototype,D.propHooks={_default:{get:function(e){var t
return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=K.css(e.elem,e.prop,""))&&"auto"!==t?t:0:e.elem[e.prop]},set:function(e){K.fx.step[e.prop]?K.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[K.cssProps[e.prop]]||K.cssHooks[e.prop])?K.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},D.propHooks.scrollTop=D.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},K.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},K.fx=D.prototype.init,K.fx.step={}
var Ye,Ge,Qe=/^(?:toggle|show|hide)$/,Je=new RegExp("^(?:([+-])=|)("+xe+")([a-z%]*)$","i"),Ke=/queueHooks$/,Ze=[function(e,t,n){var r,i,o,s,a,u,l,c=this,f={},p=e.style,d=e.nodeType&&we(e),h=ge.get(e,"fxshow")
n.queue||(null==(a=K._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,c.always(function(){c.always(function(){a.unqueued--,K.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===("none"===(l=K.css(e,"display"))?ge.get(e,"olddisplay")||b(e.nodeName):l)&&"none"===K.css(e,"float")&&(p.display="inline-block")),n.overflow&&(p.overflow="hidden",c.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}))
for(r in t)if(i=t[r],Qe.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(d?"hide":"show")){if("show"!==i||!h||void 0===h[r])continue
d=!0}f[r]=h&&h[r]||K.style(e,r)}else l=void 0
if(K.isEmptyObject(f))"inline"===("none"===l?b(e.nodeName):l)&&(p.display=l)
else{h?"hidden"in h&&(d=h.hidden):h=ge.access(e,"fxshow",{}),o&&(h.hidden=!d),d?K(e).show():c.done(function(){K(e).hide()}),c.done(function(){var t
ge.remove(e,"fxshow")
for(t in f)K.style(e,t,f[t])})
for(r in f)s=L(d?h[r]:0,r,c),r in h||(h[r]=s.start,d&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}],et={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Je.exec(t),o=i&&i[3]||(K.cssNumber[e]?"":"px"),s=(K.cssNumber[e]||"px"!==o&&+r)&&Je.exec(K.css(n.elem,e)),a=1,u=20
if(s&&s[3]!==o){o=o||s[3],i=i||[],s=+r||1
do{a=a||".5",s/=a,K.style(n.elem,e,s+o)}while(a!==(a=n.cur()/r)&&1!==a&&--u)}return i&&(s=n.start=+s||+r||0,n.unit=o,n.end=i[1]?s+(i[1]+1)*i[2]:+i[2]),n}]}
K.Animation=K.extend(H,{tweener:function(e,t){K.isFunction(e)?(t=e,e=["*"]):e=e.split(" ")
for(var n,r=0,i=e.length;i>r;r++)n=e[r],et[n]=et[n]||[],et[n].unshift(t)},prefilter:function(e,t){t?Ze.unshift(e):Ze.push(e)}}),K.speed=function(e,t,n){var r=e&&"object"==typeof e?K.extend({},e):{complete:n||!n&&t||K.isFunction(e)&&e,duration:e,easing:n&&t||t&&!K.isFunction(t)&&t}
return r.duration=K.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in K.fx.speeds?K.fx.speeds[r.duration]:K.fx.speeds._default,(null==r.queue||!0===r.queue)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){K.isFunction(r.old)&&r.old.call(this),r.queue&&K.dequeue(this,r.queue)},r},K.fn.extend({fadeTo:function(e,t,n,r){return this.filter(we).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=K.isEmptyObject(e),o=K.speed(t,n,r),s=function(){var t=H(this,K.extend({},e),o);(i||ge.get(this,"finish"))&&t.stop(!0)}
return s.finish=s,i||!1===o.queue?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop
delete e.stop,t(n)}
return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=K.timers,s=ge.get(this)
if(i)s[i]&&s[i].stop&&r(s[i])
else for(i in s)s[i]&&s[i].stop&&Ke.test(i)&&r(s[i])
for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&K.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=ge.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=K.timers,s=r?r.length:0
for(n.finish=!0,K.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1))
for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this)
delete n.finish})}}),K.each(["toggle","show","hide"],function(e,t){var n=K.fn[t]
K.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(A(t,!0),e,r,i)}}),K.each({slideDown:A("show"),slideUp:A("hide"),slideToggle:A("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){K.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),K.timers=[],K.fx.tick=function(){var e,t=0,n=K.timers
for(Ye=K.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1)
n.length||K.fx.stop(),Ye=void 0},K.fx.timer=function(e){K.timers.push(e),e()?K.fx.start():K.timers.pop()},K.fx.interval=13,K.fx.start=function(){Ge||(Ge=setInterval(K.fx.tick,K.fx.interval))},K.fx.stop=function(){clearInterval(Ge),Ge=null},K.fx.speeds={slow:600,fast:200,_default:400},K.fn.delay=function(e,t){return e=K.fx?K.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e)
n.stop=function(){clearTimeout(r)}})},function(){var e=Q.createElement("input"),t=Q.createElement("select"),n=t.appendChild(Q.createElement("option"))
e.type="checkbox",G.checkOn=""!==e.value,G.optSelected=n.selected,t.disabled=!0,G.optDisabled=!n.disabled,(e=Q.createElement("input")).value="t",e.type="radio",G.radioValue="t"===e.value}()
var tt,nt=K.expr.attrHandle
K.fn.extend({attr:function(e,t){return he(this,K.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){K.removeAttr(this,e)})}}),K.extend({attr:function(e,t,n){var r,i,o=e.nodeType
if(e&&3!==o&&8!==o&&2!==o)return typeof e.getAttribute===Ce?K.prop(e,t,n):(1===o&&K.isXMLDoc(e)||(t=t.toLowerCase(),r=K.attrHooks[t]||(K.expr.match.bool.test(t)?tt:void 0)),void 0===n?r&&"get"in r&&null!==(i=r.get(e,t))?i:null==(i=K.find.attr(e,t))?void 0:i:null!==n?r&&"set"in r&&void 0!==(i=r.set(e,n,t))?i:(e.setAttribute(t,n+""),n):void K.removeAttr(e,t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(fe)
if(o&&1===e.nodeType)for(;n=o[i++];)r=K.propFix[n]||n,K.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!G.radioValue&&"radio"===t&&K.nodeName(e,"input")){var n=e.value
return e.setAttribute("type",t),n&&(e.value=n),t}}}}}),tt={set:function(e,t,n){return!1===t?K.removeAttr(e,n):e.setAttribute(n,n),n}},K.each(K.expr.match.bool.source.match(/\w+/g),function(e,t){var n=nt[t]||K.find.attr
nt[t]=function(e,t,r){var i,o
return r||(o=nt[t],nt[t]=i,i=null!=n(e,t,r)?t.toLowerCase():null,nt[t]=o),i}})
var rt=/^(?:input|select|textarea|button)$/i
K.fn.extend({prop:function(e,t){return he(this,K.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[K.propFix[e]||e]})}}),K.extend({propFix:{for:"htmlFor",class:"className"},prop:function(e,t,n){var r,i,o=e.nodeType
if(e&&3!==o&&8!==o&&2!==o)return(1!==o||!K.isXMLDoc(e))&&(t=K.propFix[t]||t,i=K.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||rt.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),G.optSelected||(K.propHooks.selected={get:function(e){var t=e.parentNode
return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),K.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){K.propFix[this.toLowerCase()]=this})
var it=/[\t\r\n\f]/g
K.fn.extend({addClass:function(e){var t,n,r,i,o,s,a="string"==typeof e&&e,u=0,l=this.length
if(K.isFunction(e))return this.each(function(t){K(this).addClass(e.call(this,t,this.className))})
if(a)for(t=(e||"").match(fe)||[];l>u;u++)if(n=this[u],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(it," "):" ")){for(o=0;i=t[o++];)r.indexOf(" "+i+" ")<0&&(r+=i+" ")
s=K.trim(r),n.className!==s&&(n.className=s)}return this},removeClass:function(e){var t,n,r,i,o,s,a=0===arguments.length||"string"==typeof e&&e,u=0,l=this.length
if(K.isFunction(e))return this.each(function(t){K(this).removeClass(e.call(this,t,this.className))})
if(a)for(t=(e||"").match(fe)||[];l>u;u++)if(n=this[u],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(it," "):"")){for(o=0;i=t[o++];)for(;r.indexOf(" "+i+" ")>=0;)r=r.replace(" "+i+" "," ")
s=e?K.trim(r):"",n.className!==s&&(n.className=s)}return this},toggleClass:function(e,t){var n=typeof e
return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):this.each(K.isFunction(e)?function(n){K(this).toggleClass(e.call(this,n,this.className,t),t)}:function(){if("string"===n)for(var t,r=0,i=K(this),o=e.match(fe)||[];t=o[r++];)i.hasClass(t)?i.removeClass(t):i.addClass(t)
else(n===Ce||"boolean"===n)&&(this.className&&ge.set(this,"__className__",this.className),this.className=this.className||!1===e?"":ge.get(this,"__className__")||"")})},hasClass:function(e){for(var t=" "+e+" ",n=0,r=this.length;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(it," ").indexOf(t)>=0)return!0
return!1}})
var ot=/\r/g
K.fn.extend({val:function(e){var t,n,r,i=this[0]
return arguments.length?(r=K.isFunction(e),this.each(function(n){var i
1===this.nodeType&&(null==(i=r?e.call(this,n,K(this).val()):e)?i="":"number"==typeof i?i+="":K.isArray(i)&&(i=K.map(i,function(e){return null==e?"":e+""})),(t=K.valHooks[this.type]||K.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))})):i?(t=K.valHooks[i.type]||K.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(ot,""):null==n?"":n:void 0}}),K.extend({valHooks:{option:{get:function(e){var t=K.find.attr(e,"value")
return null!=t?t:K.trim(K.text(e))}},select:{get:function(e){for(var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;a>u;u++)if(!(!(n=r[u]).selected&&u!==i||(G.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&K.nodeName(n.parentNode,"optgroup"))){if(t=K(n).val(),o)return t
s.push(t)}return s},set:function(e,t){for(var n,r,i=e.options,o=K.makeArray(t),s=i.length;s--;)r=i[s],(r.selected=K.inArray(r.value,o)>=0)&&(n=!0)
return n||(e.selectedIndex=-1),o}}}}),K.each(["radio","checkbox"],function(){K.valHooks[this]={set:function(e,t){return K.isArray(t)?e.checked=K.inArray(K(e).val(),t)>=0:void 0}},G.checkOn||(K.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),K.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){K.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),K.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}})
var st=K.now(),at=/\?/
K.parseJSON=function(e){return JSON.parse(e+"")},K.parseXML=function(e){var t
if(!e||"string"!=typeof e)return null
try{t=(new DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return(!t||t.getElementsByTagName("parsererror").length)&&K.error("Invalid XML: "+e),t}
var ut=/#.*$/,lt=/([?&])_=[^&]*/,ct=/^(.*?):[ \t]*([^\r\n]*)$/gm,ft=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,pt=/^(?:GET|HEAD)$/,dt=/^\/\//,ht=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,gt={},vt={},mt="*/".concat("*"),yt=e.location.href,xt=ht.exec(yt.toLowerCase())||[]
K.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yt,type:"GET",isLocal:ft.test(xt[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":mt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":K.parseJSON,"text xml":K.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?P(P(e,K.ajaxSettings),t):P(K.ajaxSettings,e)},ajaxPrefilter:O(gt),ajaxTransport:O(vt),ajax:function(e,t){function n(e,t,n,s){var u,c,m,y,b,T=t
2!==x&&(x=2,a&&clearTimeout(a),r=void 0,o=s||"",w.readyState=e>0?4:0,u=e>=200&&300>e||304===e,n&&(y=R(f,w,n)),y=M(f,y,w,u),u?(f.ifModified&&((b=w.getResponseHeader("Last-Modified"))&&(K.lastModified[i]=b),(b=w.getResponseHeader("etag"))&&(K.etag[i]=b)),204===e||"HEAD"===f.type?T="nocontent":304===e?T="notmodified":(T=y.state,c=y.data,m=y.error,u=!m)):(m=T,(e||!T)&&(T="error",0>e&&(e=0))),w.status=e,w.statusText=(t||T)+"",u?h.resolveWith(p,[c,T,w]):h.rejectWith(p,[w,T,m]),w.statusCode(v),v=void 0,l&&d.trigger(u?"ajaxSuccess":"ajaxError",[w,f,u?c:m]),g.fireWith(p,[w,T]),l&&(d.trigger("ajaxComplete",[w,f]),--K.active||K.event.trigger("ajaxStop")))}"object"==typeof e&&(t=e,e=void 0),t=t||{}
var r,i,o,s,a,u,l,c,f=K.ajaxSetup({},t),p=f.context||f,d=f.context&&(p.nodeType||p.jquery)?K(p):K.event,h=K.Deferred(),g=K.Callbacks("once memory"),v=f.statusCode||{},m={},y={},x=0,b="canceled",w={readyState:0,getResponseHeader:function(e){var t
if(2===x){if(!s)for(s={};t=ct.exec(o);)s[t[1].toLowerCase()]=t[2]
t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?o:null},setRequestHeader:function(e,t){var n=e.toLowerCase()
return x||(e=y[n]=y[n]||e,m[e]=t),this},overrideMimeType:function(e){return x||(f.mimeType=e),this},statusCode:function(e){var t
if(e)if(2>x)for(t in e)v[t]=[v[t],e[t]]
else w.always(e[w.status])
return this},abort:function(e){var t=e||b
return r&&r.abort(t),n(0,t),this}}
if(h.promise(w).complete=g.add,w.success=w.done,w.error=w.fail,f.url=((e||f.url||yt)+"").replace(ut,"").replace(dt,xt[1]+"//"),f.type=t.method||t.type||f.method||f.type,f.dataTypes=K.trim(f.dataType||"*").toLowerCase().match(fe)||[""],null==f.crossDomain&&(u=ht.exec(f.url.toLowerCase()),f.crossDomain=!(!u||u[1]===xt[1]&&u[2]===xt[2]&&(u[3]||("http:"===u[1]?"80":"443"))===(xt[3]||("http:"===xt[1]?"80":"443")))),f.data&&f.processData&&"string"!=typeof f.data&&(f.data=K.param(f.data,f.traditional)),F(gt,f,t,w),2===x)return w;(l=K.event&&f.global)&&0==K.active++&&K.event.trigger("ajaxStart"),f.type=f.type.toUpperCase(),f.hasContent=!pt.test(f.type),i=f.url,f.hasContent||(f.data&&(i=f.url+=(at.test(i)?"&":"?")+f.data,delete f.data),!1===f.cache&&(f.url=lt.test(i)?i.replace(lt,"$1_="+st++):i+(at.test(i)?"&":"?")+"_="+st++)),f.ifModified&&(K.lastModified[i]&&w.setRequestHeader("If-Modified-Since",K.lastModified[i]),K.etag[i]&&w.setRequestHeader("If-None-Match",K.etag[i])),(f.data&&f.hasContent&&!1!==f.contentType||t.contentType)&&w.setRequestHeader("Content-Type",f.contentType),w.setRequestHeader("Accept",f.dataTypes[0]&&f.accepts[f.dataTypes[0]]?f.accepts[f.dataTypes[0]]+("*"!==f.dataTypes[0]?", "+mt+"; q=0.01":""):f.accepts["*"])
for(c in f.headers)w.setRequestHeader(c,f.headers[c])
if(f.beforeSend&&(!1===f.beforeSend.call(p,w,f)||2===x))return w.abort()
b="abort"
for(c in{success:1,error:1,complete:1})w[c](f[c])
if(r=F(vt,f,t,w)){w.readyState=1,l&&d.trigger("ajaxSend",[w,f]),f.async&&f.timeout>0&&(a=setTimeout(function(){w.abort("timeout")},f.timeout))
try{x=1,r.send(m,n)}catch(e){if(!(2>x))throw e
n(-1,e)}}else n(-1,"No Transport")
return w},getJSON:function(e,t,n){return K.get(e,t,n,"json")},getScript:function(e,t){return K.get(e,void 0,t,"script")}}),K.each(["get","post"],function(e,t){K[t]=function(e,n,r,i){return K.isFunction(n)&&(i=i||r,r=n,n=void 0),K.ajax({url:e,type:t,dataType:i,data:n,success:r})}}),K._evalUrl=function(e){return K.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,throws:!0})},K.fn.extend({wrapAll:function(e){var t
return K.isFunction(e)?this.each(function(t){K(this).wrapAll(e.call(this,t))}):(this[0]&&(t=K(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild
return e}).append(this)),this)},wrapInner:function(e){return this.each(K.isFunction(e)?function(t){K(this).wrapInner(e.call(this,t))}:function(){var t=K(this),n=t.contents()
n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=K.isFunction(e)
return this.each(function(n){K(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){K.nodeName(this,"body")||K(this).replaceWith(this.childNodes)}).end()}}),K.expr.filters.hidden=function(e){return e.offsetWidth<=0&&e.offsetHeight<=0},K.expr.filters.visible=function(e){return!K.expr.filters.hidden(e)}
var bt=/%20/g,wt=/\[\]$/,Tt=/\r?\n/g,Ct=/^(?:submit|button|image|reset|file)$/i,Nt=/^(?:input|select|textarea|keygen)/i
K.param=function(e,t){var n,r=[],i=function(e,t){t=K.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)}
if(void 0===t&&(t=K.ajaxSettings&&K.ajaxSettings.traditional),K.isArray(e)||e.jquery&&!K.isPlainObject(e))K.each(e,function(){i(this.name,this.value)})
else for(n in e)W(n,e[n],t,i)
return r.join("&").replace(bt,"+")},K.fn.extend({serialize:function(){return K.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=K.prop(this,"elements")
return e?K.makeArray(e):this}).filter(function(){var e=this.type
return this.name&&!K(this).is(":disabled")&&Nt.test(this.nodeName)&&!Ct.test(e)&&(this.checked||!Te.test(e))}).map(function(e,t){var n=K(this).val()
return null==n?null:K.isArray(n)?K.map(n,function(e){return{name:t.name,value:e.replace(Tt,"\r\n")}}):{name:t.name,value:n.replace(Tt,"\r\n")}}).get()}}),K.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}}
var kt=0,Et={},St={0:200,1223:204},Dt=K.ajaxSettings.xhr()
e.attachEvent&&e.attachEvent("onunload",function(){for(var e in Et)Et[e]()}),G.cors=!!Dt&&"withCredentials"in Dt,G.ajax=Dt=!!Dt,K.ajaxTransport(function(e){var t
return G.cors||Dt&&!e.crossDomain?{send:function(n,r){var i,o=e.xhr(),s=++kt
if(o.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)o[i]=e.xhrFields[i]
e.mimeType&&o.overrideMimeType&&o.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest")
for(i in n)o.setRequestHeader(i,n[i])
t=function(e){return function(){t&&(delete Et[s],t=o.onload=o.onerror=null,"abort"===e?o.abort():"error"===e?r(o.status,o.statusText):r(St[o.status]||o.status,o.statusText,"string"==typeof o.responseText?{text:o.responseText}:void 0,o.getAllResponseHeaders()))}},o.onload=t(),o.onerror=t("error"),t=Et[s]=t("abort")
try{o.send(e.hasContent&&e.data||null)}catch(e){if(t)throw e}},abort:function(){t&&t()}}:void 0}),K.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return K.globalEval(e),e}}}),K.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),K.ajaxTransport("script",function(e){if(e.crossDomain){var t,n
return{send:function(r,i){t=K("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),Q.head.appendChild(t[0])},abort:function(){n&&n()}}}})
var jt=[],At=/(=)\?(?=&|$)|\?\?/
K.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=jt.pop()||K.expando+"_"+st++
return this[e]=!0,e}}),K.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=!1!==t.jsonp&&(At.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&At.test(t.data)&&"data")
return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=K.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(At,"$1"+i):!1!==t.jsonp&&(t.url+=(at.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||K.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,jt.push(i)),s&&K.isFunction(o)&&o(s[0]),s=o=void 0}),"script"):void 0}),K.parseHTML=function(e,t,n){if(!e||"string"!=typeof e)return null
"boolean"==typeof t&&(n=t,t=!1),t=t||Q
var r=oe.exec(e),i=!n&&[]
return r?[t.createElement(r[1])]:(r=K.buildFragment([e],t,i),i&&i.length&&K(i).remove(),K.merge([],r.childNodes))}
var Lt=K.fn.load
K.fn.load=function(e,t,n){if("string"!=typeof e&&Lt)return Lt.apply(this,arguments)
var r,i,o,s=this,a=e.indexOf(" ")
return a>=0&&(r=K.trim(e.slice(a)),e=e.slice(0,a)),K.isFunction(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),s.length>0&&K.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?K("<div>").append(K.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},K.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){K.fn[t]=function(e){return this.on(t,e)}}),K.expr.filters.animated=function(e){return K.grep(K.timers,function(t){return e===t.elem}).length}
var qt=e.document.documentElement
K.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l=K.css(e,"position"),c=K(e),f={}
"static"===l&&(e.style.position="relative"),a=c.offset(),o=K.css(e,"top"),u=K.css(e,"left"),("absolute"===l||"fixed"===l)&&(o+u).indexOf("auto")>-1?(r=c.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),K.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(f.top=t.top-a.top+s),null!=t.left&&(f.left=t.left-a.left+i),"using"in t?t.using.call(e,f):c.css(f)}},K.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){K.offset.setOffset(this,e,t)})
var t,n,r=this[0],i={top:0,left:0},o=r&&r.ownerDocument
return o?(t=o.documentElement,K.contains(t,r)?(typeof r.getBoundingClientRect!==Ce&&(i=r.getBoundingClientRect()),n=$(o),{top:i.top+n.pageYOffset-t.clientTop,left:i.left+n.pageXOffset-t.clientLeft}):i):void 0},position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0}
return"fixed"===K.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),K.nodeName(e[0],"html")||(r=e.offset()),r.top+=K.css(e[0],"borderTopWidth",!0),r.left+=K.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-K.css(n,"marginTop",!0),left:t.left-r.left-K.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent||qt;e&&!K.nodeName(e,"html")&&"static"===K.css(e,"position");)e=e.offsetParent
return e||qt})}}),K.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n
K.fn[t]=function(i){return he(this,function(t,i,o){var s=$(t)
return void 0===o?s?s[n]:t[i]:void(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o)},t,i,arguments.length,null)}}),K.each(["top","left"],function(e,t){K.cssHooks[t]=T(G.pixelPosition,function(e,n){return n?(n=w(e,t),$e.test(n)?K(e).position()[t]+"px":n):void 0})}),K.each({Height:"height",Width:"width"},function(e,t){K.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){K.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(!0===r||!0===i?"margin":"border")
return he(this,function(t,n,r){var i
return K.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===r?K.css(t,n,s):K.style(t,n,r,s)},t,o?r:void 0,o,null)}})}),K.fn.size=function(){return this.length},K.fn.andSelf=K.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return K})
var Ht=e.jQuery,Ot=e.$
return K.noConflict=function(t){return e.$===K&&(e.$=Ot),t&&e.jQuery===K&&(e.jQuery=Ht),K},typeof t===Ce&&(e.jQuery=e.$=K),K})

//# sourceMappingURL=jquery.min-24b32902e0d72c914713b8e2bd8572e8.map