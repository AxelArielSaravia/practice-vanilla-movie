import u from"../general.js";async function z(f,L,h){var A;try{A=await f}catch{v.ended=!0,DocumentFragment.prototype.replaceChildren.apply(h.templateSkeleton.content,w);return}if(A?.results===void 0||A.results.length===0){v.ended=!0,DocumentFragment.prototype.replaceChildren.apply(h.templateSkeleton.content,w);return}var C;for(var c of A.results)C=u.Item.createDOMItem(c,L,h.templateItem?.content?.firstElementChild),v.fragment.appendChild(C);DocumentFragment.prototype.replaceChildren.apply(h.templateSkeleton.content,w),h.view.appendChild(v.fragment),h.buttonMore.setAttribute("data-display","1")}var v={fragment:document.createDocumentFragment(),maxPages:0,page:1,ended:!1},w=Array(6);window.addEventListener("DOMContentLoaded",function(){var f={templateSkeleton:document.getElementById("template_skeleton"),templateItem:document.getElementById("template_item"),templateModal:document.getElementById("template_modal"),headerPNav:document.getElementById("header_p_nav"),headerSearch:document.getElementById("header_search"),headerButtonTheme:document.getElementById("header_button-theme"),main:document.getElementById("main"),view:document.getElementById("view"),buttonMore:document.getElementById("button-more"),modal:document.getElementById("modal")};if(f.templateSkeleton===null)throw Error("DOM.templateSkeleton is null");if(f.templateItem===null)throw Error("DOM.templateItem is null");if(f.templateModal===null)throw Error("DOM.templateModal is null");if(f.headerPNav===null)throw Error("DOM.headerPNav is null");if(f.headerSearch===null)throw Error("DOM.headerSearch is null");if(f.headerButtonTheme===null)throw Error("DOM.headerButtonTheme is null");if(f.main===null)throw Error("DOM.main is null");if(f.view===null)throw Error("DOM.view is null");if(f.buttonMore===null)throw Error("DOM.buttonMore is null");if(f.modal===null)throw Error("DOM.modal is null");u.Route.url.href=window.location.href;var L=u.Route.url,h=L.searchParams.get(u.Route.Q_MEDIA_TYPE);if(h==="tv")f.main.firstElementChild.textContent+=" Tv Series";else if(h==="movie")f.main.firstElementChild.textContent+=" Movies";else{window.open("./404.html","_self","noopener,noreferrer");return}w[0]=f.view.children[0],w[1]=f.view.children[1],w[2]=f.view.children[2],w[3]=f.view.children[3],w[4]=f.view.children[4],w[5]=f.view.children[5],u.Theme.init(),u.Route.href=`${u.Route.href}?${u.Route.Q_MEDIA_TYPE}=${h}`,u.Route.init(f),window.addEventListener("popstate",function(){u.Route.onpopstate(f)}),f.headerButtonTheme.setAttribute("data-type",u.Theme.current),f.headerButtonTheme.addEventListener("click",u.Theme.onclick),f.headerPNav.firstElementChild.addEventListener("click",u.Nav.buttonNavOnclick),f.headerPNav.lastElementChild.addEventListener("focusout",u.Nav.navOnfocusout),f.headerSearch.children[1].addEventListener("click",function(c){f.headerSearch.reset()}),f.buttonMore.addEventListener("click",function(c){if(f.buttonMore?.setAttribute("data-display","0"),v.ended)return;f.view.appendChild(f.templateSkeleton.content),z(u.API.getTopRated(h,String(v.page)),h,f),v.page+=1}),f.view.addEventListener("click",function(c){var x=c.target,E=x.getAttribute("data-type");if(E===u.TYPE.ITEM){c.preventDefault();var b=x.getAttribute("data-id");if(b!==null)u.Modal.open(h,b,f,!0)}}),f.modal.addEventListener("click",function(c){u.Modal.onclick(c.target,f)}),f.modal.addEventListener("change",function(c){u.Modal.onchange(c.target,f)});var A=u.API.getTopRated(h,String(v.page));v.page+=1;var C=u.API.getTopRated(h,String(v.page));v.page+=1,A.then(function(c){if(c?.results===void 0||c.results.length===0)v.ended=!0,f.main.children[1].setAttribute("data-display","1");else{var x;for(var E of c.results)x=u.Item.createDOMItem(E,h,f.templateItem?.content?.firstElementChild),v.fragment.appendChild(x)}DocumentFragment.prototype.replaceChildren.apply(f.templateSkeleton.content,w),f.view.appendChild(v.fragment),A=null}),C.then(function(c){if(c?.results===void 0||c.results.length===0){v.ended=!0;return}var x;for(var E of c.results)x=u.Item.createDOMItem(E,h,f.templateItem?.content?.firstElementChild),v.fragment.appendChild(x);f.view.appendChild(v.fragment),f.buttonMore?.setAttribute("data-display","1"),C=null})});
