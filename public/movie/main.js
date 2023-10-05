import v from"../general.js";var z=function(u,b,I){var A,E,y,p=h.genres,f=h.index;u.buttonMore?.setAttribute("data-display","0");var T=0,q=!1;if(h.count+b<h.len)T=h.count+b;else T=h.len,q=!0;if(I)for(var w=h.count;w<T;w+=1){var B=u.templateCollection.content.children[0].cloneNode(!0);u.view?.appendChild(B)}var H=u.view.children.length-T,j=h.count;while(j<T)A=p[f].id,E=p[f].name,y=`${E} Movies`,v.View.discover(v.API.getDiscover("movie",A,"1"),y,"movie",j,H,u),f+=1,j+=1;if(h.index=f,h.count=j,!q)u.buttonMore?.setAttribute("data-display","1")},h={STEPS:5,len:0,count:3,index:0,genres:null};window.addEventListener("DOMContentLoaded",function(){var u={templateCollection:document.getElementById("template_collection"),templateModal:document.getElementById("template_modal"),headerButtonNav:document.getElementById("header_button-nav"),headerNav:document.getElementById("header_nav"),headerButtonSearch:document.getElementById("header_button-search"),headerButtonTheme:document.getElementById("header_button-theme"),main:document.getElementById("main"),hero:document.getElementById("hero"),view:document.getElementById("view"),buttonMore:document.getElementById("button-more"),modal:document.getElementById("modal")};if(u.templateCollection===null)throw Error("DOM.templateCollection is null");if(u.templateModal===null)throw Error("DOM.templateModal is null");if(u.headerButtonNav===null)throw Error("DOM.headerButtonNav is null");if(u.headerNav===null)throw Error("DOM.headerNav is null");if(u.headerButtonSearch===null)throw Error("DOM.headerButtonSearch is null");if(u.headerButtonTheme===null)throw Error("DOM.headerButtonTheme is null");if(u.main===null)throw Error("DOM.main is null");if(u.hero===null)throw Error("DOM.hero is null");if(u.view===null)throw Error("DOM.view is null");if(u.buttonMore===null)throw Error("DOM.buttonMore is null");if(u.modal===null)throw Error("DOM.modal is null");v.Theme.init(),v.Route.init(u),window.addEventListener("popstate",function(){v.Route.onpopstate(u)}),u.headerButtonTheme.setAttribute("data-type",v.Theme.current),u.headerButtonTheme.addEventListener("click",v.Theme.onclick),u.headerButtonNav.addEventListener("click",v.Nav.buttonNavOnclick),u.headerNav.addEventListener("focusout",v.Nav.navOnfocusout),u.view.addEventListener("click",function(E){v.View.onclick(E.target,u)}),u.hero.lastElementChild.addEventListener("click",function(E){v.Hero.DOMTitleOnclick(E.target,u)}),u.modal.addEventListener("click",function(E){v.Modal.onclick(E.target,u)}),u.modal.addEventListener("change",function(E){v.Modal.onchange(E.target,u)}),u.buttonMore.addEventListener("click",function(){z(u,h.STEPS,!0)});var b=v.API.getGenres("movie"),I=v.API.getTrending("movie","1");I.then(function(E){console.info("trending: ",E)});var A=I.then(v.Hero.selectHero);A.then(function(E){console.info("hero: ",E)}),A.then(v.Hero.getHeroLogo).then(function(E){v.Hero.initDOMImgLogo(E,u.hero)}),A.then(function(E){if(E!==void 0)v.Hero.initDOM(E,u.hero)}),I.then(function(E){if(E?.results===void 0||E.results.length===0)throw Error("API.getTrending does not have data");var y=v.View.createDOMCollection("Week Trendings",E.results,void 0,u.templateCollection.content),p=u.view.children[0];p.insertAdjacentElement("beforebegin",y),p.remove()}),v.API.getPopular("movie","1").then(function(E){if(console.info("getPopular movie",E),E?.results===void 0||E.results.length===0)throw Error("API.getDiscover does not have data");var y=v.View.createDOMCollection("Popular Movies",E.results,"movie",u.templateCollection.content),p=u.view.children[1];p.insertAdjacentElement("beforebegin",y),p.remove()}),v.API.getTopRated("movie","1").then(function(E){if(console.info("getTopRate movie",E),E?.results===void 0||E.results.length===0)throw Error("API.getTopRated does not have data");var y=v.View.createDOMCollection("Top rated movies",E.results,"movie",u.templateCollection.content),p=u.view.children[2];p.insertAdjacentElement("beforebegin",y),p.remove()}),b.then(function(E){if(E===void 0||E.genres===void 0||E.genres.length===0)throw Error("API.getGenre does not have data");h.genres=E.genres,h.len=E.genres.length,v.Utils.randomPermutation(h.genres),z(u,4,!1)})});
