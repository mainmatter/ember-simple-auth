window.PR_SHOULD_USE_CONTINUATION=!0
var prettyPrintOne,prettyPrint;(function(){function e(e){function n(e){var n=e.charCodeAt(0)
if(92!==n)return n
var t=e.charAt(1)
return(n=u[t])||("0"<=t&&t<="7"?parseInt(e.substring(1),8):"u"===t||"x"===t?parseInt(e.substring(2),16):e.charCodeAt(1))}function t(e){if(e<32)return(e<16?"\\x0":"\\x")+e.toString(16)
var n=String.fromCharCode(e)
return"\\"===n||"-"===n||"]"===n||"^"===n?"\\"+n:n}function r(e){var r=e.substring(1,e.length-1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]","g")),a=[],s="^"===r[0],i=["["]
s&&i.push("^")
for(var l=s?1:0,o=r.length;l<o;++l){var u=r[l]
if(/\\[bdsw]/i.test(u))i.push(u)
else{var c,d=n(u)
l+2<o&&"-"===r[l+1]?(c=n(r[l+2]),l+=2):c=d,a.push([d,c]),c<65||d>122||(c<65||d>90||a.push([32|Math.max(65,d),32|Math.min(c,90)]),c<97||d>122||a.push([-33&Math.max(97,d),-33&Math.min(c,122)]))}}a.sort(function(e,n){return e[0]-n[0]||n[1]-e[1]})
for(var p=[],f=[],l=0;l<a.length;++l)(g=a[l])[0]<=f[1]+1?f[1]=Math.max(f[1],g[1]):p.push(f=g)
for(l=0;l<p.length;++l){var g=p[l]
i.push(t(g[0])),g[1]>g[0]&&(g[1]+1>g[0]&&i.push("-"),i.push(t(g[1])))}return i.push("]"),i.join("")}for(var a=0,s=!1,i=!1,l=0,o=e.length;l<o;++l)if((d=e[l]).ignoreCase)i=!0
else if(/[a-z]/i.test(d.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,""))){s=!0,i=!1
break}for(var u={b:8,t:9,n:10,v:11,f:12,r:13},c=[],l=0,o=e.length;l<o;++l){var d=e[l]
if(d.global||d.multiline)throw new Error(""+d)
c.push("(?:"+function(e){for(var n=e.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)","g")),i=n.length,l=[],o=0,u=0;o<i;++o)"("===(d=n[o])?++u:"\\"===d.charAt(0)&&(c=+d.substring(1))&&(c<=u?l[c]=-1:n[o]=t(c))
for(o=1;o<l.length;++o)-1===l[o]&&(l[o]=++a)
for(var o=0,u=0;o<i;++o)if("("===(d=n[o]))l[++u]||(n[o]="(?:")
else if("\\"===d.charAt(0)){var c=+d.substring(1)
c&&c<=u&&(n[o]="\\"+l[c])}for(o=0;o<i;++o)"^"===n[o]&&"^"!==n[o+1]&&(n[o]="")
if(e.ignoreCase&&s)for(o=0;o<i;++o){var d=n[o],p=d.charAt(0)
d.length>=2&&"["===p?n[o]=r(d):"\\"!==p&&(n[o]=d.replace(/[a-zA-Z]/g,function(e){var n=e.charCodeAt(0)
return"["+String.fromCharCode(-33&n,32|n)+"]"}))}return n.join("")}(d)+")")}return new RegExp(c.join("|"),i?"gi":"g")}function n(e,n){function t(e){switch(e.nodeType){case 1:if(r.test(e.className))return
for(var o=e.firstChild;o;o=o.nextSibling)t(o)
var u=e.nodeName.toLowerCase()
"br"!==u&&"li"!==u||(a[l]="\n",i[l<<1]=s++,i[l++<<1|1]=e)
break
case 3:case 4:var c=e.nodeValue
c.length&&(c=n?c.replace(/\r\n?/g,"\n"):c.replace(/[ \t\r\n]+/g," "),a[l]=c,i[l<<1]=s,s+=c.length,i[l++<<1|1]=e)}}var r=/(?:^|\s)nocode(?:\s|$)/,a=[],s=0,i=[],l=0
return t(e),{sourceCode:a.join("").replace(/\n$/,""),spans:i}}function t(e,n,t,r){if(n){var a={sourceCode:n,basePos:e}
t(a),r.push.apply(r,a.decorations)}}function r(e){for(var n=void 0,t=e.firstChild;t;t=t.nextSibling){var r=t.nodeType
n=1===r?n?e:t:3===r&&$.test(t.nodeValue)?e:n}return n===e?void 0:n}function a(n,r){var a,s={};(function(){for(var t=n.concat(r),i=[],l={},o=0,u=t.length;o<u;++o){var c=t[o],d=c[3]
if(d)for(var p=d.length;--p>=0;)s[d.charAt(p)]=c
var f=c[1],g=""+f
l.hasOwnProperty(g)||(i.push(f),l[g]=null)}i.push(/[\0-\uffff]/),a=e(i)})()
var i=r.length,l=function(e){for(var n=e.sourceCode,o=e.basePos,c=[o,T],d=0,p=n.match(a)||[],f={},g=0,h=p.length;g<h;++g){var m,v=p[g],y=f[v],b=void 0
if("string"==typeof y)m=!1
else{var x=s[v.charAt(0)]
if(x)b=v.match(x[1]),y=x[0]
else{for(var R=0;R<i;++R)if(x=r[R],b=v.match(x[1])){y=x[0]
break}b||(y=T)}!(m=y.length>=5&&"lang-"===y.substring(0,5))||b&&"string"==typeof b[1]||(m=!1,y=A),m||(f[v]=y)}var w=d
if(d+=v.length,m){var S=b[1],P=v.indexOf(S),C=P+S.length
b[2]&&(P=(C=v.length-b[2].length)-S.length)
var N=y.substring(5)
t(o+w,v.substring(0,P),l,c),t(o+w+P,S,u(N,S),c),t(o+w+C,v.substring(C),l,c)}else c.push(o+w,y)}e.decorations=c}
return l}function s(e){var n=[],t=[]
e.tripleQuotedStrings?n.push([S,/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,"'\""]):e.multiLineStrings?n.push([S,/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]):n.push([S,/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]),e.verbatimStrings&&t.push([S,/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null])
var r=e.hashComments
if(r&&(e.cStyleComments?(r>1?n.push([C,/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,null,"#"]):n.push([C,/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]),t.push([S,/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,null])):n.push([C,/^#[^\r\n]*/,null,"#"])),e.cStyleComments&&(t.push([C,/^\/\/[^\r\n]*/,null]),t.push([C,/^\/\*[\s\S]*?(?:\*\/|$)/,null])),e.regexLiterals){t.push(["lang-regex",new RegExp("^"+k+"(/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/)")])}var s=e.types
s&&t.push([N,s])
var i=(""+e.keywords).replace(/^ | $/g,"")
i.length&&t.push([P,new RegExp("^(?:"+i.replace(/[\s,]+/g,"|")+")\\b"),null]),n.push([T,/^\s+/,null," \r\n\t "])
var l=/^.[^\s\w\.$@\'\"\`\/\\]*/
return t.push([_,/^@[a-z_$][a-z_$@0-9]*/i,null],[N,/^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/,null],[T,/^[a-z_$][a-z_$@0-9]*/i,null],[_,new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*","i"),null,"0123456789"],[T,/^\\[\s\S]?/,null],[L,l,null]),a(n,t)}function i(e,n,t){function r(e){switch(e.nodeType){case 1:if(s.test(e.className))break
if("br"===e.nodeName)a(e),e.parentNode&&e.parentNode.removeChild(e)
else for(var n=e.firstChild;n;n=n.nextSibling)r(n)
break
case 3:case 4:if(t){var o=e.nodeValue,u=o.match(i)
if(u){var c=o.substring(0,u.index)
e.nodeValue=c
var d=o.substring(u.index+u[0].length)
d&&e.parentNode.insertBefore(l.createTextNode(d),e.nextSibling),a(e),c||e.parentNode.removeChild(e)}}}}function a(e){function n(e,t){var r=t?e.cloneNode(!1):e,a=e.parentNode
if(a){var s=n(a,1),i=e.nextSibling
s.appendChild(r)
for(var l=i;l;l=i)i=l.nextSibling,s.appendChild(l)}return r}for(;!e.nextSibling;)if(!(e=e.parentNode))return
for(var t,r=n(e.nextSibling,0);(t=r.parentNode)&&1===t.nodeType;)r=t
u.push(r)}for(var s=/(?:^|\s)nocode(?:\s|$)/,i=/\r\n?|\n/,l=e.ownerDocument,o=l.createElement("li");e.firstChild;)o.appendChild(e.firstChild)
for(var u=[o],c=0;c<u.length;++c)r(u[c])
n===(0|n)&&u[0].setAttribute("value",n)
var d=l.createElement("ol")
d.className="linenums"
for(var p=Math.max(0,n-1|0)||0,c=0,f=u.length;c<f;++c)(o=u[c]).className="L"+(c+p)%10,o.firstChild||o.appendChild(l.createTextNode(" ")),d.appendChild(o)
e.appendChild(d)}function l(e){var n=/\bMSIE\s(\d+)/.exec(navigator.userAgent)
n=n&&+n[1]<=8
var t=/\n/g,r=e.sourceCode,a=r.length,s=0,i=e.spans,l=i.length,o=0,u=e.decorations,c=u.length,d=0
u[c]=a
var p,f
for(f=p=0;f<c;)u[f]!==u[f+2]?(u[p++]=u[f++],u[p++]=u[f++]):f+=2
for(c=p,f=p=0;f<c;){for(var g=u[f],h=u[f+1],m=f+2;m+2<=c&&u[m+1]===h;)m+=2
u[p++]=g,u[p++]=h,f=m}c=u.length=p
var v,y=e.sourceNode
y&&(v=y.style.display,y.style.display="none")
try{for(;o<l;){i[o]
var b,x=i[o+2]||a,R=u[d+2]||a,m=Math.min(x,R),w=i[o+1]
if(1!==w.nodeType&&(b=r.substring(s,m))){n&&(b=b.replace(t,"\r")),w.nodeValue=b
var S=w.ownerDocument,P=S.createElement("span")
P.className=u[d+1]
var C=w.parentNode
C.replaceChild(P,w),P.appendChild(w),s<x&&(i[o+1]=w=S.createTextNode(r.substring(m,x)),C.insertBefore(w,P.nextSibling))}(s=m)>=x&&(o+=2),s>=R&&(d+=2)}}finally{y&&(y.style.display=v)}}function o(e,n){for(var t=n.length;--t>=0;){var r=n[t]
I.hasOwnProperty(r)?d.console&&console.warn("cannot override language handler %s",r):I[r]=e}}function u(e,n){return e&&I.hasOwnProperty(e)||(e=/^\s*</.test(n)?"default-markup":"default-code"),I[e]}function c(e){var t=e.langExtension
try{var r=n(e.sourceNode,e.pre),a=r.sourceCode
e.sourceCode=a,e.spans=r.spans,e.basePos=0,u(t,a)(e),l(e)}catch(e){d.console&&console.log(e&&e.stack?e.stack:e)}}var d=window,p=["break,continue,do,else,for,if,return,while"],f=[[p,"auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],g=[f,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],h=[f,"abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],m=[h,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],v=[f,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],y="caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",b=[p,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],x=[p,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],R=[p,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],w=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,S="str",P="kwd",C="com",N="typ",_="lit",L="pun",T="pln",A="src",E="atv",k="(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*",$=/\S/,I={}
o(s({keywords:[g,m,v,y+b,x,R],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),["default-code"]),o(a([],[[T,/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],[C,/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],[L,/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup","htm","html","mxml","xhtml","xml","xsl"]),o(a([[T,/^[\s]+/,null," \t\r\n"],[E,/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],[L,/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]),o(a([],[[E,/^[\s\S]+/]]),["uq.val"]),o(s({keywords:g,hashComments:!0,cStyleComments:!0,types:w}),["c","cc","cpp","cxx","cyc","m"]),o(s({keywords:"null,true,false"}),["json"]),o(s({keywords:m,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:w}),["cs"]),o(s({keywords:h,cStyleComments:!0}),["java"]),o(s({keywords:R,hashComments:!0,multiLineStrings:!0}),["bsh","csh","sh"]),o(s({keywords:b,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py"]),o(s({keywords:y,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["perl","pl","pm"]),o(s({keywords:x,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb"]),o(s({keywords:v,cStyleComments:!0,regexLiterals:!0}),["js"]),o(s({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]),o(a([],[[S,/^[\s\S]+/]]),["regex"])
var O=d.PR={createSimpleLexer:a,registerLangHandler:o,sourceDecorator:s,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:E,PR_COMMENT:C,PR_DECLARATION:"dec",PR_KEYWORD:P,PR_LITERAL:_,PR_NOCODE:"nocode",PR_PLAIN:T,PR_PUNCTUATION:L,PR_SOURCE:A,PR_STRING:S,PR_TAG:"tag",PR_TYPE:N,prettyPrintOne:d.prettyPrintOne=function(e,n,t){var r=document.createElement("pre")
return r.innerHTML=e,t&&i(r,t,!0),c({langExtension:n,numberLines:t,sourceNode:r,pre:1}),r.innerHTML},prettyPrint:d.prettyPrint=function(e){function n(e){return document.getElementsByTagName(e)}function t(){for(var n=d.PR_SHOULD_USE_CONTINUATION?p.now()+250:1/0;g<s.length&&p.now()<n;g++){var a=s[g],l=a.className
if(m.test(l)&&!v.test(l)){for(var o=!1,u=a.parentNode;u;u=u.parentNode){var R=u.tagName
if(x.test(R)&&u.className&&m.test(u.className)){o=!0
break}}if(!o){a.className+=" prettyprinted"
var w,S=l.match(h)
!S&&(w=r(a))&&b.test(w.tagName)&&(S=w.className.match(h)),S&&(S=S[1])
var P
if(y.test(a.tagName))P=1
else{var C=a.currentStyle,N=C?C.whiteSpace:document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(a,null).getPropertyValue("white-space"):0
P=N&&"pre"===N.substring(0,3)}var _=a.className.match(/\blinenums\b(?::(\d+))?/);(_=!!_&&(!_[1]||!_[1].length||+_[1]))&&i(a,_,P),c(f={langExtension:S,sourceNode:a,numberLines:_,pre:P})}}}g<s.length?setTimeout(t,250):e&&e()}for(var a=[n("pre"),n("code"),n("xmp")],s=[],l=0;l<a.length;++l)for(var o=0,u=a[l].length;o<u;++o)s.push(a[l][o])
a=null
var p=Date
p.now||(p={now:function(){return+new Date}})
var f,g=0,h=/\blang(?:uage)?-([\w.]+)(?!\S)/,m=/\bprettyprint\b/,v=/\bprettyprinted\b/,y=/pre|xmp/i,b=/^code$/i,x=/^(?:pre|code|xmp)$/i
t()}}
"function"==typeof define&&define.amd&&define("google-code-prettify",[],function(){return O})})(),PR.registerLangHandler(PR.createSimpleLexer([],[[PR.PR_DECLARATION,/^<!\w[^>]*(?:>|$)/],[PR.PR_COMMENT,/^<\!--[\s\S]*?(?:-\->|$)/],[PR.PR_PUNCTUATION,/^(?:<[%?]|[%?]>)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-handlebars",/^<script\b[^>]*type\s*=\s*['"]?text\/x-handlebars-template['"]?\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i],[PR.PR_DECLARATION,/^{{[#^>/]?\s*[\w.][^}]*}}/],[PR.PR_DECLARATION,/^{{&?\s*[\w.][^}]*}}/],[PR.PR_DECLARATION,/^{{{>?\s*[\w.][^}]*}}}/],[PR.PR_COMMENT,/^{{![^}]*}}/]]),["handlebars","hbs"]),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[ \t\r\n\f]+/,null," \t\r\n\f"]],[[PR.PR_STRING,/^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/,null],[PR.PR_STRING,/^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/,null],["lang-css-str",/^url\(([^\)\"\']*)\)/i],[PR.PR_KEYWORD,/^(?:url|rgb|\!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i,null],["lang-css-kw",/^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i],[PR.PR_COMMENT,/^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],[PR.PR_COMMENT,/^(?:<!--|-->)/],[PR.PR_LITERAL,/^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],[PR.PR_LITERAL,/^#(?:[0-9a-f]{3}){1,2}/i],[PR.PR_PLAIN,/^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i],[PR.PR_PUNCTUATION,/^[^\s\w\'\"]+/]]),["css"]),PR.registerLangHandler(PR.createSimpleLexer([],[[PR.PR_KEYWORD,/^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]]),["css-kw"]),PR.registerLangHandler(PR.createSimpleLexer([],[[PR.PR_STRING,/^[^\)\"\']+/]]),["css-str"])

//# sourceMappingURL=prettify-min-15c1b579fdb7d124eed5300b7687ac5f.map