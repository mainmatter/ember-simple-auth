YUI().use("node",function(a){var n=a.all(".prettyprint.linenums")
if(n.size()){n.each(function(a){var n=a.all("ol li"),e=1
n.each(function(a){a.prepend('<a name="LINENUM_'+e+'"></a>'),e++})})
var e=location.hash
location.hash="",e=e.replace("LINE_","LINENUM_"),location.hash=e}})

//# sourceMappingURL=yui-prettify-2a5c42157e40bed6e05b7aa62414167c.map