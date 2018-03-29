YUI.add("api-list",function(e){var t=e.Lang,a=e.Array,n=e.namespace("APIList"),s=e.one("#api-classes"),r=e.one("#api-elements"),i=e.one("#api-filter"),l=e.one("#api-modules"),o=e.one("#api-tabview"),u=n.tabs={},c=n.filter=new e.APIFilter({inputNode:i,maxResults:1e3,on:{results:function(i){var o=e.one(e.config.doc.createDocumentFragment()),u=(g=c.get("queryType"),"classes"===g?s:"elements"===g?r:l),f=c.get("queryType"),d="classes"===f?"class":"elements"===f?"element":"module"
var g
i.results.length?a.each(i.results,function(e){o.append(t.sub(y,{rootPath:n.rootPath,displayName:c.getDisplayName(e.highlighted),name:e.text,typePlural:f,typeSingular:d}))}):o.append('<li class="message">No '+f+" found.</li>")
u.empty(!0),u.append(o),p.refresh()}}}),f=n.search=new e.APISearch({inputNode:i,maxResults:100,on:{clear:function(e){p.refresh()},results:function(t){var n=e.one(e.config.doc.createDocumentFragment())
t.results.length?a.each(t.results,function(e){n.append(e.display)}):n.append('<li class="message">No results found. Maybe you\'ll have better luck with a different query?</li>')
p.refresh()}}}),d=n.tabview=new e.TabView({srcNode:o,panelNode:"#api-tabview-panel",render:!0,on:{selectionChange:function(e){var t=e.newVal,a=t.get("label").toLowerCase()
switch(u.selected={index:t.get("index"),name:a,tab:t},a){case"elements":case"classes":case"modules":c.setAttrs({minQueryLength:0,queryType:a}),f.set("minQueryLength",-1),e.prevVal&&c.sendRequest(c.get("value"))
break
case"everything":c.set("minQueryLength",-1),f.set("minQueryLength",1),f.get("value")?f.sendRequest(f.get("value")):i.focus()
break
default:c.set("minQueryLength",-1),f.set("minQueryLength",-1)}p&&setTimeout(function(){p.refresh()},1)}}}),p=n.focusManager=o.plug(e.Plugin.NodeFocusManager,{circular:!0,descendants:"#api-filter, .yui3-tab-panel-selected .api-list-item a, .yui3-tab-panel-selected .result a",keys:{next:"down:40",previous:"down:38"}}).focusManager,y='<li class="api-list-item {typeSingular}"><a href="{rootPath}{typePlural}/{name}.html">{displayName}</a></li>'
e.before(function(t,a){if(t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return new e.Do.Prevent},p,"_focusPrevious",p),e.before(function(t,a){if(t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return new e.Do.Prevent},p,"_focusNext",p),d.each(function(e,t){var a=e.get("label").toLowerCase()
u[a]={index:t,name:a,tab:e}}),o.on("key",function(t){var a=u.selected.index
if(!t.ctrlKey&&!t.metaKey)return
switch(t.preventDefault(),t.keyCode){case 37:a>0&&(d.selectChild(a-1),i.focus())
break
case 39:a<e.Object.size(u)-2&&(d.selectChild(a+1),i.focus())}},"down:37,39"),e.one(e.config.doc).on("key",function(e){var t=e.target
if(t.test("input,select,textarea")||t.get("isContentEditable"))return
e.preventDefault(),i.focus(),p.refresh()},"down:83"),i.on("focus",function(){p.set("activeDescendant",i)}),d.get("panelNode").all("a").each(function(e){e.setAttribute("href",e.get("href"))})},"3.4.0",{requires:["api-filter","api-search","event-key","node-focusmanager","tabview"]})

//# sourceMappingURL=api-list-ff18b8f54f6e03db760f326ce1485bb4.map