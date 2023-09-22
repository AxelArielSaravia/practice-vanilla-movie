var W=function($){if($.ok)return $.json()};var B={getTrending($="1"){return fetch(`${window.location.origin}/api/trending?page=${$}`).then(W)},getPopular($,_="1"){return fetch(`${window.location.origin}/api/popular?type=${$}&page=${_}`).then(W)},getDiscover($,_,u="1"){var U=`${window.location.origin}/api/discover?type=${$}&page=${u}`;if(_!==void 0)U=`${U}&genre=${_}`;return fetch(U).then(W)},getImages($,_,u="1"){return fetch(`${window.location.origin}/api/images?type=${_}&id=${$}&page=${u}`).then(W)},getGenres($){return fetch(`${window.location.origin}/api/genres?type=${$}`).then(W)},getTopRated($,_="1"){return fetch(`${window.location.origin}/api/toprated?type=${$}&page=${_}`).then(W)}},J=B;var G=function($){return Math.floor(Math.random()*$)};async function H($,_,u){const U=await $;if(U===void 0||U.backdrops===void 0||U.backdrops.length===0){_.firstElementChild.setAttribute("data-display","1");var z=u.content.firstElementChild?.cloneNode(!0);_.appendChild(z)}else{const k=U.backdrops[0],q=_.lastElementChild;q.setAttribute("src",`https://image.tmdb.org/t/p/w400${k.file_path}`),q.setAttribute("data-display","1")}}var X=function($,_,u,U,z,k){const b=U.content.cloneNode(!0).firstElementChild;b.children[0].insertAdjacentText("beforeend",$);for(let K of _){const Q=z.content.cloneNode(!0).firstElementChild;Q.setAttribute("data-id",K.id);let x,F;if(u!==void 0)F=u;else F=K.media_type;if(F==="movie")x=K.title;else x=K.name;Q.setAttribute("title",x),Q.firstElementChild.insertAdjacentText("beforeend",x),Q.lastElementChild.setAttribute("alt",x),H(J.getImages(K.id,F),Q,k),b.lastElementChild.appendChild(Q)}return b},f={NAV_LINK:"0",COLL_TITLE:"4",COLL_BUTTON:"5"},L={MAX:20,genresMax:0,count:7},w={current:"dark",DARK:"dark",LIGHT:"light",init(){const $=localStorage.getItem("theme");if($==="dark"||$==="light")w.current=$;else{if(window.matchMedia!==void 0&&window.matchMedia("(prefers-color-scheme: dark)").matches)w.current=w.DARK;else w.current=w.LIGHT;localStorage.setItem("theme",w.current)}document.firstElementChild?.setAttribute("class",w.current)},change($){localStorage.setItem("theme",$),document.firstElementChild?.setAttribute("class",w.current)},onclick($){const _=$.currentTarget;if(_===null)return;if(w.current===w.DARK)w.current=w.LIGHT;else w.current=w.DARK;_.setAttribute("data-type",w.current),w.change(w.current)}},E={ATTR_SHOW:"data-mbshow",ATTR_SELECTED:"data-selected",ATTR_LINK_TYPE:"data-linkt",HIDDEN:"0",SHOW:"1",buttonNavOnclick($){console.info($);const u=$.currentTarget.nextElementSibling;if(u.getAttribute(E.ATTR_SHOW)===E.HIDDEN)u.setAttribute(E.ATTR_SHOW,E.SHOW),u.firstElementChild.firstElementChild.focus();else u.setAttribute(E.ATTR_SHOW,E.HIDDEN)},navOnfocusout($){const _=$.relatedTarget;if(_===null||_.getAttribute("data-type")!==f.NAV_LINK)$.currentTarget.setAttribute(E.ATTR_SHOW,E.HIDDEN)},navOnclick($){const _=$.target;if(_.getAttribute("data-type")===f.NAV_LINK){const u=_.getAttribute(E.ATTR_LINK_TYPE),U=$.currentTarget,z=U.previousElementSibling;z.replaceChildren(),z.insertAdjacentText("beforeend",_.textContent),U.setAttribute(E.ATTR_SHOW,E.HIDDEN),U.setAttribute(E.ATTR_SELECTED,u),$.preventDefault()}}},j={select($){const _=G($.length);return $[_]},selectHero($){if($){if(!$.results||$.results.length===0)throw Error("trending.results does not have data");return j.select($.results)}},async getHeroLogo($){if($===void 0)return;const{id:_,media_type:u}=$;let U=await J.getImages(_,u);if(U.logos.length>0)return U.logos[0].file_path;else return},initDOMImgLogo($,_){const u=_.lastElementChild.firstElementChild;if($)u.lastElementChild.setAttribute("data-display","1"),u.lastElementChild.setAttribute("src",`https://image.tmdb.org/t/p/w300${$}`);else u.firstElementChild.setAttribute("data-display","1")},initDOM($,_){const u=_.firstElementChild.firstElementChild,U=_.lastElementChild,z=U.firstElementChild.firstElementChild,k=U.children[2];u.setAttribute("data-display","1"),u.setAttribute("src",`https://image.tmdb.org/t/p/w1280${$.backdrop_path}`),z.textContent=$.title,k.textContent=$.overview}},Y={TYPE_SBUTTON:"data-sbuttont",onclick($){var _=$.target;if(_?.getAttribute("data-type")===f.COLL_BUTTON){var u=_.parentElement.lastElementChild;const k=_.parentElement.children[1],q=_.parentElement.children[2];var U=_.getAttribute(Y.TYPE_SBUTTON),z=u.clientWidth-u.clientWidth*6/100;if(u.scrollLeft-z<=0)k.setAttribute("data-display","0");else k.setAttribute("data-display","1");if(U==="0"){if(u.scrollBy(-z,0),u.scrollLeft-z<=0)k.setAttribute("data-display","0");q.setAttribute("data-display","1")}else{if(u.scrollBy(z,0),u.scrollLeft+z>=u.scrollWidth-u.clientWidth)q.setAttribute("data-display","0");k.setAttribute("data-display","1")}}}},R={pointerFine:window.matchMedia("(pointer: fine)")};window.addEventListener("DOMContentLoaded",function(){const $={templateCollection:document.getElementById("template_collection"),templateCollSkeleton:document.getElementById("template_collection-skeleton"),templateCollItem:document.getElementById("template_collection-item"),templateIcons:document.getElementById("template_icons"),headerButtonNav:document.getElementById("header_button-nav"),headerNav:document.getElementById("header_nav"),headerButtonSearch:document.getElementById("header_button-search"),headerButtonTheme:document.getElementById("header_button-theme"),main:document.getElementById("main"),hero:document.getElementById("hero"),view:document.getElementById("view"),buttonMore:document.getElementById("button-more")};if($.templateCollection===null)throw Error("DOM.templateCollection is null");if($.templateCollSkeleton===null)throw Error("DOM.templateCollSkeleton is null");if($.templateCollItem===null)throw Error("DOM.templateCollItem is null");if($.templateIcons===null)throw Error("DOM.templateIcons is null");if($.headerButtonNav===null)throw Error("DOM.headerButtonNav is null");if($.headerNav===null)throw Error("DOM.headerNav is null");if($.headerButtonSearch===null)throw Error("DOM.headerButtonSearch is null");if($.headerButtonTheme===null)throw Error("DOM.headerButtonTheme is null");if($.main===null)throw Error("DOM.main is null");if($.hero===null)throw Error("DOM.hero is null");if($.view===null)throw Error("DOM.view is null");if($.buttonMore===null)throw Error("DOM.buttonMore is null");if(w.init(),$.headerButtonTheme.setAttribute("data-type",w.current),$.headerButtonTheme.addEventListener("click",w.onclick),$.headerButtonNav.addEventListener("click",E.buttonNavOnclick),$.headerNav.addEventListener("focusout",E.navOnfocusout),$.headerNav.addEventListener("click",E.navOnclick),R.pointerFine.matches)$.view.onclick=Y.onclick;R.pointerFine.onchange=function(k){if(k.matches)$.view.onclick=Y.onclick;else $.view.onclick=null};const _=J.getTrending("1");_.then(console.info);const u=_.then(j.selectHero);u.then(console.info),u.then(j.getHeroLogo).then(function(k){if(k!==void 0)j.initDOMImgLogo(k,$.hero)}),u.then(function(k){if(k!==void 0)j.initDOM(k,$.hero)}),_.then(function(k){if(k?.results===void 0||k.results.length===0)throw Error("API.getTrending does not have data");let q=X("Week Trendings",k.results,void 0,$.templateCollection,$.templateCollItem,$.templateIcons);const b=$.view.children[0];b.insertAdjacentElement("beforebegin",q),b.remove()}),J.getPopular("movie","1").then(function(k){if(console.info("getPopular movie",k),k?.results===void 0||k.results.length===0)throw Error("API.getDiscover does not have data");let q=X("Popular Movies",k.results,"movie",$.templateCollection,$.templateCollItem,$.templateIcons);const b=$.view.children[1];b.insertAdjacentElement("beforebegin",q),b.remove()}),J.getPopular("tv","1").then(function(k){if(console.info("getPopular tv",k),k?.results===void 0||k.results.length===0)throw Error("API.getDiscover does not have data");let q=X("Popular Tv series",k.results,"tv",$.templateCollection,$.templateCollItem,$.templateIcons);const b=$.view.children[2];b.insertAdjacentElement("beforebegin",q),b.remove()}),J.getTopRated("movie","1").then(function(k){if(console.info("getTopRate movie",k),k?.results===void 0||k.results.length===0)throw Error("API.getTopRated does not have data");let q=X("Top rated movie",k.results,"movie",$.templateCollection,$.templateCollItem,$.templateIcons);const b=$.view.children[3];b.insertAdjacentElement("beforebegin",q),b.remove()}),J.getTopRated("tv","1").then(function(k){if(console.info("getTopRate tv",k),k?.results===void 0||k.results.length===0)throw Error("API.getTopRated does not have data");let q=X("Top rated tv serie",k.results,"tv",$.templateCollection,$.templateCollItem,$.templateIcons);const b=$.view.children[4];b.insertAdjacentElement("beforebegin",q),b.remove()});const U=J.getGenres("movie"),z=J.getGenres("tv");Promise.all([U,z]).then(function(k){if(console.info("movie genres",k[0]),console.info("tv genres",k[1]),k[0]===void 0||k[0].genres===void 0||k[0].genres.length===0)throw Error("API.getGenre does not have data");if(k[1]===void 0||k[1].genres===void 0||k[1].genres.length===0)throw Error("API.getGenre does not have data");L.genresMax=k[0].genres.length+k[1].genres.length;for(let q=0;q<2;q+=1){let b,Z,K,Q;if(Math.random()<0.5){let x=k[0].genres;const F=Math.floor(Math.random()*x.length);Z=x[F].id,K=x[F].name,b="movie",Q=`${K} Tv series`}else{let x=k[1].genres;const F=Math.floor(Math.random()*x.length);Z=x[F].id,K=x[F].name,b="tv",Q=`${K} Movies`}J.getDiscover(b,Z).then(function(x){if(console.info(Z,x),x?.results===void 0||x.results.length===0)throw Error("API.getTopRated does not have data");let F=X(Q,x.results,b,$.templateCollection,$.templateCollItem,$.templateIcons);const V=$.view.children[5+q];V.insertAdjacentElement("beforebegin",F),V.remove()})}})});
