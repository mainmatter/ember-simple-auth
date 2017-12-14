YUI().use("node",function(a){var n=a.all(".prettyprint.linenums")
if(n.size()){n.each(function(a){var n=1
a.all("ol li").each(function(a){a.prepend('<a name="LINENUM_'+n+'"></a>'),n++})})
var e=location.hash
location.hash="",e=e.replace("LINE_","LINENUM_"),location.hash=e}})

//# sourceMappingURL=yui-prettify-529a458219d0b2ef4704a32eeed99f83.map