var prettyPrintOne,prettyPrint
window.PR_SHOULD_USE_CONTINUATION=!0,function(){var e=window,n=["break,continue,do,else,for,if,return,while"],t=[[n,"auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],r=[t,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],a=[t,"abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],s=[a,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],i=[t,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],l="caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",o=[n,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],u=[n,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],c=[n,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],d=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,p="str",f="kwd",g="com",h="typ",m="lit",v="pun",y="pln",b="src",x="atv",R="(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*"
function w(e,n,t,r){if(n){var a={sourceCode:n,basePos:e}
t(a),r.push.apply(r,a.decorations)}}var S=/\S/
function P(e){for(var n=void 0,t=e.firstChild;t;t=t.nextSibling){var r=t.nodeType
n=1===r?n?e:t:3===r&&S.test(t.nodeValue)?e:n}return n===e?void 0:n}function C(e,n){var t,r={};(function(){for(var a=e.concat(n),s=[],i={},l=0,o=a.length;l<o;++l){var u=a[l],c=u[3]
if(c)for(var d=c.length;--d>=0;)r[c.charAt(d)]=u
var p=u[1],f=""+p
i.hasOwnProperty(f)||(s.push(p),i[f]=null)}s.push(/[\0-\uffff]/),t=function(e){for(var n=0,t=!1,r=!1,a=0,s=e.length;a<s;++a)if((p=e[a]).ignoreCase)r=!0
else if(/[a-z]/i.test(p.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,""))){t=!0,r=!1
break}var i={b:8,t:9,n:10,v:11,f:12,r:13}
function l(e){var n=e.charCodeAt(0)
if(92!==n)return n
var t=e.charAt(1)
return(n=i[t])||("0"<=t&&t<="7"?parseInt(e.substring(1),8):"u"===t||"x"===t?parseInt(e.substring(2),16):e.charCodeAt(1))}function o(e){if(e<32)return(e<16?"\\x0":"\\x")+e.toString(16)
var n=String.fromCharCode(e)
return"\\"===n||"-"===n||"]"===n||"^"===n?"\\"+n:n}function u(e){var n=e.substring(1,e.length-1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]","g")),t=[],r="^"===n[0],a=["["]
r&&a.push("^")
for(var s=r?1:0,i=n.length;s<i;++s){var u=n[s]
if(/\\[bdsw]/i.test(u))a.push(u)
else{var c,d=l(u)
s+2<i&&"-"===n[s+1]?(c=l(n[s+2]),s+=2):c=d,t.push([d,c]),c<65||d>122||(c<65||d>90||t.push([32|Math.max(65,d),32|Math.min(c,90)]),c<97||d>122||t.push([-33&Math.max(97,d),-33&Math.min(c,122)]))}}t.sort(function(e,n){return e[0]-n[0]||n[1]-e[1]})
var p=[],f=[]
for(s=0;s<t.length;++s)(g=t[s])[0]<=f[1]+1?f[1]=Math.max(f[1],g[1]):p.push(f=g)
for(s=0;s<p.length;++s){var g=p[s]
a.push(o(g[0])),g[1]>g[0]&&(g[1]+1>g[0]&&a.push("-"),a.push(o(g[1])))}return a.push("]"),a.join("")}function c(e){for(var r=e.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)","g")),a=r.length,s=[],i=0,l=0;i<a;++i)"("===(d=r[i])?++l:"\\"===d.charAt(0)&&(c=+d.substring(1))&&(c<=l?s[c]=-1:r[i]=o(c))
for(i=1;i<s.length;++i)-1===s[i]&&(s[i]=++n)
for(i=0,l=0;i<a;++i){var c
"("===(d=r[i])?s[++l]||(r[i]="(?:"):"\\"===d.charAt(0)&&(c=+d.substring(1))&&c<=l&&(r[i]="\\"+s[c])}for(i=0;i<a;++i)"^"===r[i]&&"^"!==r[i+1]&&(r[i]="")
if(e.ignoreCase&&t)for(i=0;i<a;++i){var d,p=(d=r[i]).charAt(0)
d.length>=2&&"["===p?r[i]=u(d):"\\"!==p&&(r[i]=d.replace(/[a-zA-Z]/g,function(e){var n=e.charCodeAt(0)
return"["+String.fromCharCode(-33&n,32|n)+"]"}))}return r.join("")}var d=[]
for(a=0,s=e.length;a<s;++a){var p
if((p=e[a]).global||p.multiline)throw new Error(""+p)
d.push("(?:"+c(p)+")")}return new RegExp(d.join("|"),r?"gi":"g")}(s)})()
var a=n.length,s=function(e){for(var i=e.sourceCode,l=e.basePos,o=[l,y],u=0,c=i.match(t)||[],d={},p=0,f=c.length;p<f;++p){var g,h=c[p],m=d[h],v=void 0
if("string"==typeof m)g=!1
else{var x=r[h.charAt(0)]
if(x)v=h.match(x[1]),m=x[0]
else{for(var R=0;R<a;++R)if(x=n[R],v=h.match(x[1])){m=x[0]
break}v||(m=y)}!(g=m.length>=5&&"lang-"===m.substring(0,5))||v&&"string"==typeof v[1]||(g=!1,m=b),g||(d[h]=m)}var S=u
if(u+=h.length,g){var P=v[1],C=h.indexOf(P),N=C+P.length
v[2]&&(C=(N=h.length-v[2].length)-P.length)
var _=m.substring(5)
w(l+S,h.substring(0,C),s,o),w(l+S+C,P,E(_,P),o),w(l+S+N,h.substring(N),s,o)}else o.push(l+S,m)}e.decorations=o}
return s}function N(e){var n=[],t=[]
e.tripleQuotedStrings?n.push([p,/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,"'\""]):e.multiLineStrings?n.push([p,/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]):n.push([p,/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]),e.verbatimStrings&&t.push([p,/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null])
var r=e.hashComments
if(r&&(e.cStyleComments?(r>1?n.push([g,/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,null,"#"]):n.push([g,/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]),t.push([p,/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,null])):n.push([g,/^#[^\r\n]*/,null,"#"])),e.cStyleComments&&(t.push([g,/^\/\/[^\r\n]*/,null]),t.push([g,/^\/\*[\s\S]*?(?:\*\/|$)/,null])),e.regexLiterals){t.push(["lang-regex",new RegExp("^"+R+"(/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/)")])}var a=e.types
a&&t.push([h,a])
var s=(""+e.keywords).replace(/^ | $/g,"")
s.length&&t.push([f,new RegExp("^(?:"+s.replace(/[\s,]+/g,"|")+")\\b"),null]),n.push([y,/^\s+/,null," \r\n\t "])
return t.push([m,/^@[a-z_$][a-z_$@0-9]*/i,null],[h,/^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/,null],[y,/^[a-z_$][a-z_$@0-9]*/i,null],[m,new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*","i"),null,"0123456789"],[y,/^\\[\s\S]?/,null],[v,/^.[^\s\w\.$@\'\"\`\/\\]*/,null]),C(n,t)}var _=N({keywords:[r,s,i,l+o,u,c],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0})
function L(e,n,t){for(var r=/(?:^|\s)nocode(?:\s|$)/,a=/\r\n?|\n/,s=e.ownerDocument,i=s.createElement("li");e.firstChild;)i.appendChild(e.firstChild)
var l=[i]
function o(e){switch(e.nodeType){case 1:if(r.test(e.className))break
if("br"===e.nodeName)u(e),e.parentNode&&e.parentNode.removeChild(e)
else for(var n=e.firstChild;n;n=n.nextSibling)o(n)
break
case 3:case 4:if(t){var i=e.nodeValue,l=i.match(a)
if(l){var c=i.substring(0,l.index)
e.nodeValue=c
var d=i.substring(l.index+l[0].length)
if(d)e.parentNode.insertBefore(s.createTextNode(d),e.nextSibling)
u(e),c||e.parentNode.removeChild(e)}}}}function u(e){for(;!e.nextSibling;)if(!(e=e.parentNode))return
for(var n,t=function e(n,t){var r=t?n.cloneNode(!1):n,a=n.parentNode
if(a){var s=e(a,1),i=n.nextSibling
s.appendChild(r)
for(var l=i;l;l=i)i=l.nextSibling,s.appendChild(l)}return r}(e.nextSibling,0);(n=t.parentNode)&&1===n.nodeType;)t=n
l.push(t)}for(var c=0;c<l.length;++c)o(l[c])
n===(0|n)&&l[0].setAttribute("value",n)
var d=s.createElement("ol")
d.className="linenums"
for(var p=Math.max(0,n-1|0)||0,f=(c=0,l.length);c<f;++c)(i=l[c]).className="L"+(c+p)%10,i.firstChild||i.appendChild(s.createTextNode(" ")),d.appendChild(i)
e.appendChild(d)}var T={}
function A(n,t){for(var r=t.length;--r>=0;){var a=t[r]
T.hasOwnProperty(a)?e.console&&console.warn("cannot override language handler %s",a):T[a]=n}}function E(e,n){return e&&T.hasOwnProperty(e)||(e=/^\s*</.test(n)?"default-markup":"default-code"),T[e]}function k(n){var t=n.langExtension
try{var r=function(e,n){var t=/(?:^|\s)nocode(?:\s|$)/,r=[],a=0,s=[],i=0
return function e(l){switch(l.nodeType){case 1:if(t.test(l.className))return
for(var o=l.firstChild;o;o=o.nextSibling)e(o)
var u=l.nodeName.toLowerCase()
"br"!==u&&"li"!==u||(r[i]="\n",s[i<<1]=a++,s[i++<<1|1]=l)
break
case 3:case 4:var c=l.nodeValue
c.length&&(c=n?c.replace(/\r\n?/g,"\n"):c.replace(/[ \t\r\n]+/g," "),r[i]=c,s[i<<1]=a,a+=c.length,s[i++<<1|1]=l)}}(e),{sourceCode:r.join("").replace(/\n$/,""),spans:s}}(n.sourceNode,n.pre),a=r.sourceCode
n.sourceCode=a,n.spans=r.spans,n.basePos=0,E(t,a)(n),function(e){var n=/\bMSIE\s(\d+)/.exec(navigator.userAgent)
n=n&&+n[1]<=8
var t,r,a=/\n/g,s=e.sourceCode,i=s.length,l=0,o=e.spans,u=o.length,c=0,d=e.decorations,p=d.length,f=0
for(d[p]=i,r=t=0;r<p;)d[r]!==d[r+2]?(d[t++]=d[r++],d[t++]=d[r++]):r+=2
for(p=t,r=t=0;r<p;){for(var g=d[r],h=d[r+1],m=r+2;m+2<=p&&d[m+1]===h;)m+=2
d[t++]=g,d[t++]=h,r=m}p=d.length=t
var v,y=e.sourceNode
y&&(v=y.style.display,y.style.display="none")
try{for(;c<u;){o[c]
var b,x=o[c+2]||i,R=d[f+2]||i,w=(m=Math.min(x,R),o[c+1])
if(1!==w.nodeType&&(b=s.substring(l,m))){n&&(b=b.replace(a,"\r")),w.nodeValue=b
var S=w.ownerDocument,P=S.createElement("span")
P.className=d[f+1]
var C=w.parentNode
C.replaceChild(P,w),P.appendChild(w),l<x&&(o[c+1]=w=S.createTextNode(s.substring(m,x)),C.insertBefore(w,P.nextSibling))}(l=m)>=x&&(c+=2),l>=R&&(f+=2)}}finally{y&&(y.style.display=v)}}(n)}catch(n){e.console&&console.log(n&&n.stack?n.stack:n)}}A(_,["default-code"]),A(C([],[[y,/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],[g,/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],[v,/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup","htm","html","mxml","xhtml","xml","xsl"]),A(C([[y,/^[\s]+/,null," \t\r\n"],[x,/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],[v,/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]),A(C([],[[x,/^[\s\S]+/]]),["uq.val"]),A(N({keywords:r,hashComments:!0,cStyleComments:!0,types:d}),["c","cc","cpp","cxx","cyc","m"]),A(N({keywords:"null,true,false"}),["json"]),A(N({keywords:s,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:d}),["cs"]),A(N({keywords:a,cStyleComments:!0}),["java"]),A(N({keywords:c,hashComments:!0,multiLineStrings:!0}),["bsh","csh","sh"]),A(N({keywords:o,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py"]),A(N({keywords:l,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["perl","pl","pm"]),A(N({keywords:u,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb"]),A(N({keywords:i,cStyleComments:!0,regexLiterals:!0}),["js"]),A(N({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]),A(C([],[[p,/^[\s\S]+/]]),["regex"])
var $=e.PR={createSimpleLexer:C,registerLangHandler:A,sourceDecorator:N,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:x,PR_COMMENT:g,PR_DECLARATION:"dec",PR_KEYWORD:f,PR_LITERAL:m,PR_NOCODE:"nocode",PR_PLAIN:y,PR_PUNCTUATION:v,PR_SOURCE:b,PR_STRING:p,PR_TAG:"tag",PR_TYPE:h,prettyPrintOne:e.prettyPrintOne=function(e,n,t){var r=document.createElement("pre")
return r.innerHTML=e,t&&L(r,t,!0),k({langExtension:n,numberLines:t,sourceNode:r,pre:1}),r.innerHTML},prettyPrint:e.prettyPrint=function(n){function t(e){return document.getElementsByTagName(e)}for(var r=[t("pre"),t("code"),t("xmp")],a=[],s=0;s<r.length;++s)for(var i=0,l=r[s].length;i<l;++i)a.push(r[s][i])
r=null
var o=Date
o.now||(o={now:function(){return+new Date}})
var u=0,c=/\blang(?:uage)?-([\w.]+)(?!\S)/,d=/\bprettyprint\b/,p=/\bprettyprinted\b/,f=/pre|xmp/i,g=/^code$/i,h=/^(?:pre|code|xmp)$/i;(function t(){for(var r=e.PR_SHOULD_USE_CONTINUATION?o.now()+250:1/0;u<a.length&&o.now()<r;u++){var s=a[u],i=s.className
if(d.test(i)&&!p.test(i)){for(var l=!1,m=s.parentNode;m;m=m.parentNode){var v=m.tagName
if(h.test(v)&&m.className&&d.test(m.className)){l=!0
break}}if(!l){s.className+=" prettyprinted"
var y,b,x=i.match(c)
if(!x&&(y=P(s))&&g.test(y.tagName)&&(x=y.className.match(c)),x&&(x=x[1]),f.test(s.tagName))b=1
else{var R=s.currentStyle,w=R?R.whiteSpace:document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(s,null).getPropertyValue("white-space"):0
b=w&&"pre"===w.substring(0,3)}var S=s.className.match(/\blinenums\b(?::(\d+))?/);(S=!!S&&(!S[1]||!S[1].length||+S[1]))&&L(s,S,b),k({langExtension:x,sourceNode:s,numberLines:S,pre:b})}}}u<a.length?setTimeout(t,250):n&&n()})()}}
"function"==typeof define&&define.amd&&define("google-code-prettify",[],function(){return $})}(),PR.registerLangHandler(PR.createSimpleLexer([],[[PR.PR_DECLARATION,/^<!\w[^>]*(?:>|$)/],[PR.PR_COMMENT,/^<\!--[\s\S]*?(?:-\->|$)/],[PR.PR_PUNCTUATION,/^(?:<[%?]|[%?]>)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-handlebars",/^<script\b[^>]*type\s*=\s*['"]?text\/x-handlebars-template['"]?\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i],[PR.PR_DECLARATION,/^{{[#^>/]?\s*[\w.][^}]*}}/],[PR.PR_DECLARATION,/^{{&?\s*[\w.][^}]*}}/],[PR.PR_DECLARATION,/^{{{>?\s*[\w.][^}]*}}}/],[PR.PR_COMMENT,/^{{![^}]*}}/]]),["handlebars","hbs"]),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[ \t\r\n\f]+/,null," \t\r\n\f"]],[[PR.PR_STRING,/^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/,null],[PR.PR_STRING,/^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/,null],["lang-css-str",/^url\(([^\)\"\']*)\)/i],[PR.PR_KEYWORD,/^(?:url|rgb|\!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i,null],["lang-css-kw",/^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i],[PR.PR_COMMENT,/^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],[PR.PR_COMMENT,/^(?:<!--|-->)/],[PR.PR_LITERAL,/^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],[PR.PR_LITERAL,/^#(?:[0-9a-f]{3}){1,2}/i],[PR.PR_PLAIN,/^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i],[PR.PR_PUNCTUATION,/^[^\s\w\'\"]+/]]),["css"]),PR.registerLangHandler(PR.createSimpleLexer([],[[PR.PR_KEYWORD,/^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]]),["css-kw"]),PR.registerLangHandler(PR.createSimpleLexer([],[[PR.PR_STRING,/^[^\)\"\']+/]]),["css-str"])

//# sourceMappingURL=prettify-min-e7eaed9cd16f33190aac6c1983fc3fc6.map