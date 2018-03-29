!function(e){"undefined"!=typeof exports?e(exports):(window.hljs=e({}),"function"==typeof define&&define.amd&&define("hljs",[],function(){return window.hljs}))}(function(e){function n(e){return e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function r(e){return e.nodeName.toLowerCase()}function t(e,n){var r=e&&e.exec(n)
return r&&0==r.index}function a(e){return/^(no-?highlight|plain|text)$/i.test(e)}function i(e,n){var r,t={}
for(r in e)t[r]=e[r]
if(n)for(r in n)t[r]=n[r]
return t}function o(e){var n=[]
return function e(t,a){for(var i=t.firstChild;i;i=i.nextSibling)3==i.nodeType?a+=i.nodeValue.length:1==i.nodeType&&(n.push({event:"start",offset:a,node:i}),a=e(i,a),r(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:i}))
return a}(e,0),n}function c(e,t,a){function i(){return e.length&&t.length?e[0].offset!=t[0].offset?e[0].offset<t[0].offset?e:t:"start"==t[0].event?e:t:e.length?e:t}function o(e){l+="<"+r(e)+Array.prototype.map.call(e.attributes,function(e){return" "+e.nodeName+'="'+n(e.value)+'"'}).join("")+">"}function c(e){l+="</"+r(e)+">"}function s(e){("start"==e.event?o:c)(e.node)}for(var u=0,l="",f=[];e.length||t.length;){var b=i()
if(l+=n(a.substr(u,b[0].offset-u)),u=b[0].offset,b==e){f.reverse().forEach(c)
do{s(b.splice(0,1)[0]),b=i()}while(b==e&&b.length&&b[0].offset==u)
f.reverse().forEach(o)}else"start"==b[0].event?f.push(b[0].node):f.pop(),s(b.splice(0,1)[0])}return l+n(a.substr(u))}function s(e){function n(e){return e&&e.source||e}function r(r,t){return new RegExp(n(r),"m"+(e.cI?"i":"")+(t?"g":""))}(function t(a,o){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var c={},s=function(n,r){e.cI&&(r=r.toLowerCase()),r.split(" ").forEach(function(e){var r=e.split("|")
c[r[0]]=[n,r[1]?Number(r[1]):1]})}
"string"==typeof a.k?s("keyword",a.k):Object.keys(a.k).forEach(function(e){s(e,a.k[e])}),a.k=c}a.lR=r(a.l||/\b\w+\b/,!0),o&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=r(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=r(a.e)),a.tE=n(a.e)||"",a.eW&&o.tE&&(a.tE+=(a.e?"|":"")+o.tE)),a.i&&(a.iR=r(a.i)),void 0===a.r&&(a.r=1),a.c||(a.c=[])
var u=[]
a.c.forEach(function(e){e.v?e.v.forEach(function(n){u.push(i(e,n))}):u.push("self"==e?a:e)}),a.c=u,a.c.forEach(function(e){t(e,a)}),a.starts&&t(a.starts,o)
var l=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean)
a.t=l.length?r(l.join("|"),!0):{exec:function(){return null}}}})(e)}function u(e,r,a,i){function o(e,n){for(var r=0;r<n.c.length;r++)if(t(n.c[r].bR,e))return n.c[r]}function c(e,n){if(t(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent
return e}return e.eW?c(e.parent,n):void 0}function f(e,n){return!a&&t(n.iR,e)}function b(e,n){var r=E.cI?n[0].toLowerCase():n[0]
return e.k.hasOwnProperty(r)&&e.k[r]}function g(e,n,r,t){var a='<span class="'+(t?"":h.classPrefix)
return(a+=e+'">')+n+(r?"":"</span>")}function v(){return void 0!==R.sL?function(){var e="string"==typeof R.sL
if(e&&!p[R.sL])return n(M)
var r=e?u(R.sL,M,!0,y[R.sL]):l(M,R.sL.length?R.sL:void 0)
return R.r>0&&(C+=r.r),e&&(y[R.sL]=r.top),g(r.language,r.value,!1,!0)}():function(){if(!R.k)return n(M)
var e="",r=0
R.lR.lastIndex=0
for(var t=R.lR.exec(M);t;){e+=n(M.substr(r,t.index-r))
var a=b(R,t)
a?(C+=a[1],e+=g(a[0],n(t[0]))):e+=n(t[0]),r=R.lR.lastIndex,t=R.lR.exec(M)}return e+n(M.substr(r))}()}function m(e,r){var t=e.cN?g(e.cN,"",!0):""
e.rB?(x+=t,M=""):e.eB?(x+=n(r)+t,M=""):(x+=t,M=r),R=Object.create(e,{parent:{value:R}})}function N(e,r){if(M+=e,void 0===r)return x+=v(),0
var t=o(r,R)
if(t)return x+=v(),m(t,r),t.rB?0:r.length
var a=c(R,r)
if(a){var i=R
i.rE||i.eE||(M+=r),x+=v()
do{R.cN&&(x+="</span>"),C+=R.r,R=R.parent}while(R!=a.parent)
return i.eE&&(x+=n(r)),M="",a.starts&&m(a.starts,""),i.rE?0:r.length}if(f(r,R))throw new Error('Illegal lexeme "'+r+'" for mode "'+(R.cN||"<unnamed>")+'"')
return M+=r,r.length||1}var E=d(e)
if(!E)throw new Error('Unknown language: "'+e+'"')
s(E)
var w,R=i||E,y={},x=""
for(w=R;w!=E;w=w.parent)w.cN&&(x=g(w.cN,"",!0)+x)
var M="",C=0
try{for(var k,L,B=0;R.t.lastIndex=B,k=R.t.exec(r);)L=N(r.substr(B,k.index-B),k[0]),B=k.index+L
for(N(r.substr(B)),w=R;w.parent;w=w.parent)w.cN&&(x+="</span>")
return{r:C,value:x,language:e,top:R}}catch(e){if(-1!=e.message.indexOf("Illegal"))return{r:0,value:n(r)}
throw e}}function l(e,r){r=r||h.languages||Object.keys(p)
var t={r:0,value:n(e)},a=t
return r.forEach(function(n){if(d(n)){var r=u(n,e,!1)
r.language=n,r.r>a.r&&(a=r),r.r>t.r&&(a=t,t=r)}}),a.language&&(t.second_best=a),t}function f(e){return h.tabReplace&&(e=e.replace(/^((<[^>]+>|\t)+)/gm,function(e,n){return n.replace(/\t/g,h.tabReplace)})),h.useBR&&(e=e.replace(/\n/g,"<br>")),e}function b(e){var n=function(e){var n,r,t,i=e.className+" "
if(i+=e.parentNode?e.parentNode.className:"",r=/\blang(?:uage)?-([\w-]+)\b/i.exec(i))return d(r[1])?r[1]:"no-highlight"
for(n=0,t=(i=i.split(/\s+/)).length;t>n;n++)if(d(i[n])||a(i[n]))return i[n]}(e)
if(!a(n)){var r
h.useBR?(r=document.createElementNS("http://www.w3.org/1999/xhtml","div")).innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n"):r=e
var t=r.textContent,i=n?u(n,t,!0):l(t),s=o(r)
if(s.length){var b=document.createElementNS("http://www.w3.org/1999/xhtml","div")
b.innerHTML=i.value,i.value=c(s,o(b),t)}i.value=f(i.value),e.innerHTML=i.value,e.className=function(e,n,r){var t=n?v[n]:r,a=[e.trim()]
return e.match(/\bhljs\b/)||a.push("hljs"),-1===e.indexOf(t)&&a.push(t),a.join(" ").trim()}(e.className,n,i.language),e.result={language:i.language,re:i.r},i.second_best&&(e.second_best={language:i.second_best.language,re:i.second_best.r})}}function g(){if(!g.called){g.called=!0
var e=document.querySelectorAll("pre code")
Array.prototype.forEach.call(e,b)}}function d(e){return e=e.toLowerCase(),p[e]||p[v[e]]}var h={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},p={},v={}
return e.highlight=u,e.highlightAuto=l,e.fixMarkup=f,e.highlightBlock=b,e.configure=function(e){h=i(h,e)},e.initHighlighting=g,e.initHighlightingOnLoad=function(){addEventListener("DOMContentLoaded",g,!1),addEventListener("load",g,!1)},e.registerLanguage=function(n,r){var t=p[n]=r(e)
t.aliases&&t.aliases.forEach(function(e){v[e]=n})},e.listLanguages=function(){return Object.keys(p)},e.getLanguage=d,e.inherit=i,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/},e.C=function(n,r,t){var a=e.inherit({cN:"comment",b:n,e:r,c:[]},t||{})
return a.c.push(e.PWM),a.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),a},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e}),hljs.registerLanguage("json",function(e){var n={literal:"true false null"},r=[e.QSM,e.CNM],t={cN:"value",e:",",eW:!0,eE:!0,c:r,k:n},a={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:!0,eE:!0,c:[e.BE],i:"\\n",starts:t}],i:"\\S"},i={b:"\\[",e:"\\]",c:[e.inherit(t,{cN:null})],i:"\\S"}
return r.splice(r.length,0,a,i),{c:r,k:n,i:"\\S"}}),hljs.registerLanguage("javascript",function(e){return{aliases:["js"],k:{keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},c:[{cN:"pi",r:10,b:/^\s*['"]use (strict|asm)['"]/},e.ASM,e.QSM,{cN:"string",b:"`",e:"`",c:[e.BE,{cN:"subst",b:"\\$\\{",e:"\\}"}]},e.CLCM,e.CBCM,{cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{b:/</,e:/>\s*[);\]]/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:[e.CLCM,e.CBCM]}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+e.IR,r:0},{bK:"import",e:"[;$]",k:"import from as",c:[e.ASM,e.QSM]},{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]}],i:/#/}}),hljs.registerLanguage("handlebars",function(e){var n="each in with if else unless bindattr action collection debugger log outlet template unbound view yield"
return{aliases:["hbs","html.hbs","html.handlebars"],cI:!0,sL:"xml",c:[{cN:"expression",b:"{{",e:"}}",c:[{cN:"begin-block",b:"#[a-zA-Z- .]+",k:n},{cN:"string",b:'"',e:'"'},{cN:"end-block",b:"\\/[a-zA-Z- .]+",k:n},{cN:"variable",b:"[a-zA-Z-.]+",k:n}]}]}})

//# sourceMappingURL=highlight.pack-8970a54358237657fb67a8f0b08f4b00.map