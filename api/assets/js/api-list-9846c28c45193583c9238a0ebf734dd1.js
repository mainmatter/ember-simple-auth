YUI.add("api-list",function(e){function t(){var e=f.get("queryType")
return"classes"===e?r:"elements"===e?i:o}var a=e.Lang,n=e.Array,s=e.namespace("APIList"),r=e.one("#api-classes"),i=e.one("#api-elements"),l=e.one("#api-filter"),o=e.one("#api-modules"),u=e.one("#api-tabview"),c=s.tabs={},f=s.filter=new e.APIFilter({inputNode:l,maxResults:1e3,on:{results:function(r){var i=e.one(e.config.doc.createDocumentFragment()),l=t(),o=f.get("queryType"),u="classes"===o?"class":"elements"===o?"element":"module"
r.results.length?n.each(r.results,function(e){i.append(a.sub(g,{rootPath:s.rootPath,displayName:f.getDisplayName(e.highlighted),name:e.text,typePlural:o,typeSingular:u}))}):i.append('<li class="message">No '+o+" found.</li>"),l.empty(!0),l.append(i),y.refresh()}}}),d=s.search=new e.APISearch({inputNode:l,maxResults:100,on:{clear:function(e){y.refresh()},results:function(t){var a=e.one(e.config.doc.createDocumentFragment())
t.results.length?n.each(t.results,function(e){a.append(e.display)}):a.append('<li class="message">No results found. Maybe you\'ll have better luck with a different query?</li>'),y.refresh()}}}),p=s.tabview=new e.TabView({srcNode:u,panelNode:"#api-tabview-panel",render:!0,on:{selectionChange:function(e){var t=e.newVal,a=t.get("label").toLowerCase()
switch(c.selected={index:t.get("index"),name:a,tab:t},a){case"elements":case"classes":case"modules":f.setAttrs({minQueryLength:0,queryType:a}),d.set("minQueryLength",-1),e.prevVal&&f.sendRequest(f.get("value"))
break
case"everything":f.set("minQueryLength",-1),d.set("minQueryLength",1),d.get("value")?d.sendRequest(d.get("value")):l.focus()
break
default:f.set("minQueryLength",-1),d.set("minQueryLength",-1)}y&&setTimeout(function(){y.refresh()},1)}}}),y=s.focusManager=u.plug(e.Plugin.NodeFocusManager,{circular:!0,descendants:"#api-filter, .yui3-tab-panel-selected .api-list-item a, .yui3-tab-panel-selected .result a",keys:{next:"down:40",previous:"down:38"}}).focusManager,g='<li class="api-list-item {typeSingular}"><a href="{rootPath}{typePlural}/{name}.html">{displayName}</a></li>'
e.before(function(t,a){if(t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return new e.Do.Prevent},y,"_focusPrevious",y),e.before(function(t,a){if(t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return new e.Do.Prevent},y,"_focusNext",y),p.each(function(e,t){var a=e.get("label").toLowerCase()
c[a]={index:t,name:a,tab:e}}),u.on("key",function(t){var a=c.selected.index
if(t.ctrlKey||t.metaKey)switch(t.preventDefault(),t.keyCode){case 37:a>0&&(p.selectChild(a-1),l.focus())
break
case 39:a<e.Object.size(c)-2&&(p.selectChild(a+1),l.focus())}},"down:37,39"),e.one(e.config.doc).on("key",function(e){var t=e.target
t.test("input,select,textarea")||t.get("isContentEditable")||(e.preventDefault(),l.focus(),y.refresh())},"down:83"),l.on("focus",function(){y.set("activeDescendant",l)}),p.get("panelNode").all("a").each(function(e){e.setAttribute("href",e.get("href"))})},"3.4.0",{requires:["api-filter","api-search","event-key","node-focusmanager","tabview"]})

//# sourceMappingURL=api-list-96bfa70055106879374f4d511cf4ab7d.map