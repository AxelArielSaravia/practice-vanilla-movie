import o from"../general.js";window.addEventListener("DOMContentLoaded",function(){var h={templateSkeleton:document.getElementById("template_skeleton"),templateItem:document.getElementById("template_item"),templateModal:document.getElementById("template_modal"),headerPNav:document.getElementById("header_p_nav"),headerButtonSearch:document.getElementById("header_button-search"),headerButtonTheme:document.getElementById("header_button-theme"),main:document.getElementById("main"),buttonMore:document.getElementById("button-more"),modal:document.getElementById("modal")};if(h.templateSkeleton===null)throw Error("DOM.templateSkeleton is null");if(h.templateItem===null)throw Error("DOM.templateItem is null");if(h.templateModal===null)throw Error("DOM.templateModal is null");if(h.headerPNav===null)throw Error("DOM.headerPNav is null");if(h.headerButtonSearch===null)throw Error("DOM.headerButtonSearch is null");if(h.headerButtonTheme===null)throw Error("DOM.headerButtonTheme is null");if(h.main===null)throw Error("DOM.main is null");if(h.buttonMore===null)throw Error("DOM.buttonMore is null");if(h.modal===null)throw Error("DOM.modal is null");o.Route.url.href=window.location.href;var v=o.Route.url,t=v.searchParams.get(o.Route.Q_TITLE),k=v.searchParams.get(o.Route.Q_MEDIA_TYPE),w=v.searchParams.get(o.Route.Q_GENRE),C=v.searchParams.get(o.Route.Q_MEDIA_TYPE),I=v.searchParams.get(o.Route.Q_MEDIA_TYPE),L=v.searchParams.get(o.Route.Q_MEDIA_TYPE);if(k===null)throw Error("Bad Route");if(t!==null)h.main.firstElementChild.textContent=t;if(w!==null)o.API.getDiscover(k,"1",w,void 0,void 0,void 0).then(console.info);else if(I!==null)o.API.getDiscover(k,"1",void 0,I,void 0,void 0).then(console.info);else if(C!==null)o.API.getDiscover(k,"1",void 0,void 0,C,void 0).then(console.info);else if(L!==null)o.API.getDiscover(k,"1",void 0,void 0,void 0,L).then(console.info);else throw Error("Bad Route");o.Theme.init(),o.Route.init(h),window.addEventListener("popstate",function(){o.Route.onpopstate(h)}),h.headerButtonTheme.setAttribute("data-type",o.Theme.current),h.headerButtonTheme.addEventListener("click",o.Theme.onclick),h.headerPNav.firstElementChild.addEventListener("click",o.Nav.buttonNavOnclick),h.headerPNav.lastElementChild.addEventListener("focusout",o.Nav.navOnfocusout)});
