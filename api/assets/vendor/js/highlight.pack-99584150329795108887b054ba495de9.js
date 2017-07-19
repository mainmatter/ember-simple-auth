!function(e){"undefined"!=typeof exports?e(exports):(window.hljs=e({}),"function"==typeof define&&define.amd&&define("hljs",[],function(){return window.hljs}))}(function(e){function n(e){return e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function r(e){return e.nodeName.toLowerCase()}function t(e,n){var r=e&&e.exec(n)
return r&&0==r.index}function a(e){return/^(no-?highlight|plain|text)$/i.test(e)}function i(e){var n,r,t,i=e.className+" "
if(i+=e.parentNode?e.parentNode.className:"",r=/\blang(?:uage)?-([\w-]+)\b/i.exec(i))return E(r[1])?r[1]:"no-highlight"
for(i=i.split(/\s+/),n=0,t=i.length;t>n;n++)if(E(i[n])||a(i[n]))return i[n]}function o(e,n){var r,t={}
for(r in e)t[r]=e[r]
if(n)for(r in n)t[r]=n[r]
return t}function c(e){var n=[]
return function e(t,a){for(var i=t.firstChild;i;i=i.nextSibling)3==i.nodeType?a+=i.nodeValue.length:1==i.nodeType&&(n.push({event:"start",offset:a,node:i}),a=e(i,a),r(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:i}))
return a}(e,0),n}function s(e,t,a){function i(){return e.length&&t.length?e[0].offset!=t[0].offset?e[0].offset<t[0].offset?e:t:"start"==t[0].event?e:t:e.length?e:t}function o(e){function t(e){return" "+e.nodeName+'="'+n(e.value)+'"'}l+="<"+r(e)+Array.prototype.map.call(e.attributes,t).join("")+">"}function c(e){l+="</"+r(e)+">"}function s(e){("start"==e.event?o:c)(e.node)}for(var u=0,l="",f=[];e.length||t.length;){var b=i()
if(l+=n(a.substr(u,b[0].offset-u)),u=b[0].offset,b==e){f.reverse().forEach(c)
do{s(b.splice(0,1)[0]),b=i()}while(b==e&&b.length&&b[0].offset==u)
f.reverse().forEach(o)}else"start"==b[0].event?f.push(b[0].node):f.pop(),s(b.splice(0,1)[0])}return l+n(a.substr(u))}function u(e){function n(e){return e&&e.source||e}function r(r,t){return new RegExp(n(r),"m"+(e.cI?"i":"")+(t?"g":""))}function t(a,i){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var c={},s=function(n,r){e.cI&&(r=r.toLowerCase()),r.split(" ").forEach(function(e){var r=e.split("|")
c[r[0]]=[n,r[1]?Number(r[1]):1]})}
"string"==typeof a.k?s("keyword",a.k):Object.keys(a.k).forEach(function(e){s(e,a.k[e])}),a.k=c}a.lR=r(a.l||/\b\w+\b/,!0),i&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=r(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=r(a.e)),a.tE=n(a.e)||"",a.eW&&i.tE&&(a.tE+=(a.e?"|":"")+i.tE)),a.i&&(a.iR=r(a.i)),void 0===a.r&&(a.r=1),a.c||(a.c=[])
var u=[]
a.c.forEach(function(e){e.v?e.v.forEach(function(n){u.push(o(e,n))}):u.push("self"==e?a:e)}),a.c=u,a.c.forEach(function(e){t(e,a)}),a.starts&&t(a.starts,i)
var l=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean)
a.t=l.length?r(l.join("|"),!0):{exec:function(){return null}}}}t(e)}function l(e,r,a,i){function o(e,n){for(var r=0;r<n.c.length;r++)if(t(n.c[r].bR,e))return n.c[r]}function c(e,n){if(t(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent
return e}return e.eW?c(e.parent,n):void 0}function s(e,n){return!a&&t(n.iR,e)}function b(e,n){var r=N.cI?n[0].toLowerCase():n[0]
return e.k.hasOwnProperty(r)&&e.k[r]}function g(e,n,r,t){var a=t?"":w.classPrefix,i='<span class="'+a,o=r?"":"</span>"
return(i+=e+'">')+n+o}function d(){if(!x.k)return n(k)
var e="",r=0
x.lR.lastIndex=0
for(var t=x.lR.exec(k);t;){e+=n(k.substr(r,t.index-r))
var a=b(x,t)
a?(L+=a[1],e+=g(a[0],n(t[0]))):e+=n(t[0]),r=x.lR.lastIndex,t=x.lR.exec(k)}return e+n(k.substr(r))}function h(){var e="string"==typeof x.sL
if(e&&!R[x.sL])return n(k)
var r=e?l(x.sL,k,!0,M[x.sL]):f(k,x.sL.length?x.sL:void 0)
return x.r>0&&(L+=r.r),e&&(M[x.sL]=r.top),g(r.language,r.value,!1,!0)}function p(){return void 0!==x.sL?h():d()}function v(e,r){var t=e.cN?g(e.cN,"",!0):""
e.rB?(C+=t,k=""):e.eB?(C+=n(r)+t,k=""):(C+=t,k=r),x=Object.create(e,{parent:{value:x}})}function m(e,r){if(k+=e,void 0===r)return C+=p(),0
var t=o(r,x)
if(t)return C+=p(),v(t,r),t.rB?0:r.length
var a=c(x,r)
if(a){var i=x
i.rE||i.eE||(k+=r),C+=p()
do{x.cN&&(C+="</span>"),L+=x.r,x=x.parent}while(x!=a.parent)
return i.eE&&(C+=n(r)),k="",a.starts&&v(a.starts,""),i.rE?0:r.length}if(s(r,x))throw new Error('Illegal lexeme "'+r+'" for mode "'+(x.cN||"<unnamed>")+'"')
return k+=r,r.length||1}var N=E(e)
if(!N)throw new Error('Unknown language: "'+e+'"')
u(N)
var y,x=i||N,M={},C=""
for(y=x;y!=N;y=y.parent)y.cN&&(C=g(y.cN,"",!0)+C)
var k="",L=0
try{for(var B,I,A=0;x.t.lastIndex=A,B=x.t.exec(r);)I=m(r.substr(A,B.index-A),B[0]),A=B.index+I
for(m(r.substr(A)),y=x;y.parent;y=y.parent)y.cN&&(C+="</span>")
return{r:L,value:C,language:e,top:x}}catch(e){if(-1!=e.message.indexOf("Illegal"))return{r:0,value:n(r)}
throw e}}function f(e,r){r=r||w.languages||Object.keys(R)
var t={r:0,value:n(e)},a=t
return r.forEach(function(n){if(E(n)){var r=l(n,e,!1)
r.language=n,r.r>a.r&&(a=r),r.r>t.r&&(a=t,t=r)}}),a.language&&(t.second_best=a),t}function b(e){return w.tabReplace&&(e=e.replace(/^((<[^>]+>|\t)+)/gm,function(e,n){return n.replace(/\t/g,w.tabReplace)})),w.useBR&&(e=e.replace(/\n/g,"<br>")),e}function g(e,n,r){var t=n?y[n]:r,a=[e.trim()]
return e.match(/\bhljs\b/)||a.push("hljs"),-1===e.indexOf(t)&&a.push(t),a.join(" ").trim()}function d(e){var n=i(e)
if(!a(n)){var r
w.useBR?(r=document.createElementNS("http://www.w3.org/1999/xhtml","div"),r.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):r=e
var t=r.textContent,o=n?l(n,t,!0):f(t),u=c(r)
if(u.length){var d=document.createElementNS("http://www.w3.org/1999/xhtml","div")
d.innerHTML=o.value,o.value=s(u,c(d),t)}o.value=b(o.value),e.innerHTML=o.value,e.className=g(e.className,n,o.language),e.result={language:o.language,re:o.r},o.second_best&&(e.second_best={language:o.second_best.language,re:o.second_best.r})}}function h(e){w=o(w,e)}function p(){if(!p.called){p.called=!0
var e=document.querySelectorAll("pre code")
Array.prototype.forEach.call(e,d)}}function v(){addEventListener("DOMContentLoaded",p,!1),addEventListener("load",p,!1)}function m(n,r){var t=R[n]=r(e)
t.aliases&&t.aliases.forEach(function(e){y[e]=n})}function N(){return Object.keys(R)}function E(e){return e=e.toLowerCase(),R[e]||R[y[e]]}var w={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},R={},y={}
return e.highlight=l,e.highlightAuto=f,e.fixMarkup=b,e.highlightBlock=d,e.configure=h,e.initHighlighting=p,e.initHighlightingOnLoad=v,e.registerLanguage=m,e.listLanguages=N,e.getLanguage=E,e.inherit=o,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/},e.C=function(n,r,t){var a=e.inherit({cN:"comment",b:n,e:r,c:[]},t||{})
return a.c.push(e.PWM),a.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),a},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e}),hljs.registerLanguage("json",function(e){var n={literal:"true false null"},r=[e.QSM,e.CNM],t={cN:"value",e:",",eW:!0,eE:!0,c:r,k:n},a={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:!0,eE:!0,c:[e.BE],i:"\\n",starts:t}],i:"\\S"},i={b:"\\[",e:"\\]",c:[e.inherit(t,{cN:null})],i:"\\S"}
return r.splice(r.length,0,a,i),{c:r,k:n,i:"\\S"}}),hljs.registerLanguage("javascript",function(e){return{aliases:["js"],k:{keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},c:[{cN:"pi",r:10,b:/^\s*['"]use (strict|asm)['"]/},e.ASM,e.QSM,{cN:"string",b:"`",e:"`",c:[e.BE,{cN:"subst",b:"\\$\\{",e:"\\}"}]},e.CLCM,e.CBCM,{cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{b:/</,e:/>\s*[);\]]/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:[e.CLCM,e.CBCM]}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+e.IR,r:0},{bK:"import",e:"[;$]",k:"import from as",c:[e.ASM,e.QSM]},{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]}],i:/#/}}),hljs.registerLanguage("handlebars",function(e){var n="each in with if else unless bindattr action collection debugger log outlet template unbound view yield"
return{aliases:["hbs","html.hbs","html.handlebars"],cI:!0,sL:"xml",c:[{cN:"expression",b:"{{",e:"}}",c:[{cN:"begin-block",b:"#[a-zA-Z- .]+",k:n},{cN:"string",b:'"',e:'"'},{cN:"end-block",b:"\\/[a-zA-Z- .]+",k:n},{cN:"variable",b:"[a-zA-Z-.]+",k:n}]}]}})
