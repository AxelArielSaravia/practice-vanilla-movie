import u from"../general.js";async function K(E,_,B){var f;try{f=await E}catch{h.ended=!0,DocumentFragment.prototype.replaceChildren.apply(B.templateSkeleton.content,N);return}if(f?.results===void 0||f.results.length===0){h.ended=!0,DocumentFragment.prototype.replaceChildren.apply(B.templateSkeleton.content,N);return}console.info(f);var F;for(var R of f.results)F=u.Item.createDOMItem(R,_,B.templateItem?.content?.firstElementChild),h.fragment.appendChild(F);DocumentFragment.prototype.replaceChildren.apply(B.templateSkeleton.content,N),B.view.appendChild(h.fragment),B.buttonMore.setAttribute("data-display","1")}var h={fragment:document.createDocumentFragment(),maxPages:0,page:3,ended:!1},N=Array(6);window.addEventListener("DOMContentLoaded",function(){var E={templateSkeleton:document.getElementById("template_skeleton"),templateItem:document.getElementById("template_item"),templateModal:document.getElementById("template_modal"),headerPNav:document.getElementById("header_p_nav"),headerButtonSearch:document.getElementById("header_button-search"),headerButtonTheme:document.getElementById("header_button-theme"),main:document.getElementById("main"),view:document.getElementById("view"),buttonMore:document.getElementById("button-more"),modal:document.getElementById("modal")};if(E.templateSkeleton===null)throw Error("DOM.templateSkeleton is null");if(E.templateItem===null)throw Error("DOM.templateItem is null");if(E.templateModal===null)throw Error("DOM.templateModal is null");if(E.headerPNav===null)throw Error("DOM.headerPNav is null");if(E.headerButtonSearch===null)throw Error("DOM.headerButtonSearch is null");if(E.headerButtonTheme===null)throw Error("DOM.headerButtonTheme is null");if(E.main===null)throw Error("DOM.main is null");if(E.view===null)throw Error("DOM.view is null");if(E.buttonMore===null)throw Error("DOM.buttonMore is null");if(E.modal===null)throw Error("DOM.modal is null");u.Route.url.href=window.location.href;var _=u.Route.url,B=_.searchParams.get(u.Route.Q_TITLE),f=_.searchParams.get(u.Route.Q_MEDIA_TYPE),F=_.searchParams.get(u.Route.Q_GENRE),R=_.searchParams.get(u.Route.Q_CREW),x=_.searchParams.get(u.Route.Q_CAST),z=_.searchParams.get(u.Route.Q_COMPANY);if(f===null)throw Error("Bad Route");if(B!==null)E.main.firstElementChild.textContent=B;var A,C;if(console.info(f,F,R,x,z),F!==null)A=u.API.getDiscover(f,"1",F,void 0,void 0,void 0),C=u.API.getDiscover(f,"2",F,void 0,void 0,void 0),u.Route.hrefq=`${u.Route.href}?${u.Route.Q_TITLE}=${B}&${u.Route.Q_GENRE}=${F}&`;else if(x!==null)A=u.API.getDiscover(f,"1",void 0,x,void 0,void 0),C=u.API.getDiscover(f,"2",void 0,x,void 0,void 0),u.Route.hrefq=`${u.Route.href}?${u.Route.Q_TITLE}=${B}&${u.Route.Q_CAST}=${x}&`;else if(R!==null)A=u.API.getDiscover(f,"1",void 0,void 0,R,void 0),C=u.API.getDiscover(f,"2",void 0,void 0,R,void 0),u.Route.hrefq=`${u.Route.href}?${u.Route.Q_TITLE}=${B}&${u.Route.Q_CREW}=${R}&`;else if(z!==null)A=u.API.getDiscover(f,"1",void 0,void 0,void 0,z),C=u.API.getDiscover(f,"2",void 0,void 0,void 0,z),u.Route.hrefq=`${u.Route.href}?${u.Route.Q_TITLE}=${B}&${u.Route.Q_COMPANY}=${z}&`;else throw Error("Bad Route");N[0]=E.view.children[0],N[1]=E.view.children[1],N[2]=E.view.children[2],N[3]=E.view.children[3],N[4]=E.view.children[4],N[5]=E.view.children[5],u.Theme.init(),u.Route.href=`${u.Route.hrefq}${u.Route.Q_MEDIA_TYPE}=${f}`,u.Route.init(E),window.addEventListener("popstate",function(){u.Route.onpopstate(E)}),E.headerButtonTheme.setAttribute("data-type",u.Theme.current),E.headerButtonTheme.addEventListener("click",u.Theme.onclick),E.headerPNav.firstElementChild.addEventListener("click",u.Nav.buttonNavOnclick),E.headerPNav.lastElementChild.addEventListener("focusout",u.Nav.navOnfocusout),E.buttonMore.addEventListener("click",function(){if(E.buttonMore?.setAttribute("data-display","0"),h.ended)return;E.view.appendChild(E.templateSkeleton.content);var v;if(F!==null)v=u.API.getDiscover(f,String(h.page),F,void 0,void 0,void 0);else if(x!==null)v=u.API.getDiscover(f,String(h.page),void 0,x,void 0,void 0);else if(R!==null)v=u.API.getDiscover(f,String(h.page),void 0,void 0,R,void 0);else if(z!==null)v=u.API.getDiscover(f,String(h.page),void 0,void 0,void 0,z);K(v,f,E),h.page+=1}),E.view.addEventListener("click",function(v){var b=v.target,H=b.getAttribute("data-type");if(H===u.TYPE.ITEM){v.preventDefault();var J=b.getAttribute("data-id");if(J!==null)u.Modal.open(f,J,E,!0)}}),E.modal.addEventListener("click",function(v){u.Modal.onclick(v.target,E)}),E.modal.addEventListener("change",function(v){u.Modal.onchange(v.target,E)}),A.then(function(v){if(console.info(v),v?.results===void 0||v.results.length===0){h.ended=!0,E.main.children[1].setAttribute("data-display","1");return}var b;for(var H of v.results)b=u.Item.createDOMItem(H,f,E.templateItem?.content?.firstElementChild),h.fragment.appendChild(b);DocumentFragment.prototype.replaceChildren.apply(E.templateSkeleton.content,N),E.view.appendChild(h.fragment),A=null}),C.then(function(v){if(console.info(v),v?.results===void 0||v.results.length===0){h.ended=!0;return}var b;for(var H of v.results)b=u.Item.createDOMItem(H,f,E.templateItem?.content?.firstElementChild),h.fragment.appendChild(b);E.view.appendChild(h.fragment),E.buttonMore?.setAttribute("data-display","1"),C=null})});
