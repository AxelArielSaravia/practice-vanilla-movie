import t from"../general.js";async function p(e,u,r){var i;try{i=await e}catch{a.ended=!0,DocumentFragment.prototype.replaceChildren.apply(r.templateSkeleton.content,l);return}if(i?.results===void 0||i.results.length===0){a.ended=!0,DocumentFragment.prototype.replaceChildren.apply(r.templateSkeleton.content,l);return}var d;for(var n of i.results)d=t.Item.createDOMItem(n,u,r.templateItem?.content?.firstElementChild),a.fragment.appendChild(d);DocumentFragment.prototype.replaceChildren.apply(r.templateSkeleton.content,l),r.view.appendChild(a.fragment),r.buttonMore.setAttribute("data-display","1")}var a={fragment:document.createDocumentFragment(),maxPages:0,page:1,ended:!1},l=Array(6);window.addEventListener("DOMContentLoaded",function(){var e={templateSkeleton:document.getElementById("template_skeleton"),templateItem:document.getElementById("template_item"),templateModal:document.getElementById("template_modal"),headerPNav:document.getElementById("header_p_nav"),headerSearch:document.getElementById("header_search"),headerButtonTheme:document.getElementById("header_button-theme"),main:document.getElementById("main"),view:document.getElementById("view"),buttonMore:document.getElementById("button-more"),modal:document.getElementById("modal")};if(e.templateSkeleton===null)throw Error("DOM.templateSkeleton is null");if(e.templateItem===null)throw Error("DOM.templateItem is null");if(e.templateModal===null)throw Error("DOM.templateModal is null");if(e.headerPNav===null)throw Error("DOM.headerPNav is null");if(e.headerSearch===null)throw Error("DOM.headerSearch is null");if(e.headerButtonTheme===null)throw Error("DOM.headerButtonTheme is null");if(e.main===null)throw Error("DOM.main is null");if(e.view===null)throw Error("DOM.view is null");if(e.buttonMore===null)throw Error("DOM.buttonMore is null");if(e.modal===null)throw Error("DOM.modal is null");t.Route.url.href=window.location.href;var u=t.Route.url,r=u.searchParams.get(t.Route.Q_MEDIA_TYPE);if(r==="tv")e.main.firstElementChild.textContent+=" Tv Series";else if(r==="movie")e.main.firstElementChild.textContent+=" Movies";else{window.open("./404.html","_self","noopener,noreferrer");return}l[0]=e.view.children[0],l[1]=e.view.children[1],l[2]=e.view.children[2],l[3]=e.view.children[3],l[4]=e.view.children[4],l[5]=e.view.children[5],t.Theme.init(),t.Route.href=`${t.Route.href}?${t.Route.Q_MEDIA_TYPE}=${r}`,t.Route.init(e),window.addEventListener("popstate",function(){t.Route.onpopstate(e)}),e.headerButtonTheme.setAttribute("data-type",t.Theme.current),e.headerButtonTheme.addEventListener("click",t.Theme.onclick),e.headerPNav.firstElementChild.addEventListener("click",t.Nav.buttonNavOnclick),e.headerPNav.lastElementChild.addEventListener("focusout",t.Nav.navOnfocusout),e.headerSearch.children[1].addEventListener("click",function(n){e.headerSearch.reset()}),e.buttonMore.addEventListener("click",function(n){if(e.buttonMore?.setAttribute("data-display","0"),a.ended)return;e.view.appendChild(e.templateSkeleton.content),p(t.API.getTopRated(r,String(a.page)),r,e),a.page+=1}),e.view.addEventListener("click",function(n){var o=n.target,m=o.getAttribute("data-type");if(m===t.TYPE.ITEM){n.preventDefault();var c=o.getAttribute("data-id");if(c!==null)t.Modal.open(r,c,e,!0)}}),e.modal.addEventListener("click",function(n){t.Modal.onclick(n.target,e)}),e.modal.addEventListener("change",function(n){t.Modal.onchange(n.target,e)});var i=t.API.getTopRated(r,String(a.page));a.page+=1;var d=t.API.getTopRated(r,String(a.page));a.page+=1,i.then(function(n){if(n?.results===void 0||n.results.length===0)a.ended=!0,e.main.children[1].setAttribute("data-display","1");else{var o;for(var m of n.results)o=t.Item.createDOMItem(m,r,e.templateItem?.content?.firstElementChild),a.fragment.appendChild(o)}DocumentFragment.prototype.replaceChildren.apply(e.templateSkeleton.content,l),e.view.appendChild(a.fragment),i=null}),d.then(function(n){if(n?.results===void 0||n.results.length===0){a.ended=!0;return}var o;for(var m of n.results)o=t.Item.createDOMItem(m,r,e.templateItem?.content?.firstElementChild),a.fragment.appendChild(o);e.view.appendChild(a.fragment),e.buttonMore?.setAttribute("data-display","1"),d=null})});
