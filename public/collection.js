import x from"./general.js";var Q={COLL_TITLE:"4",COLL_BUTTON:"5"},z={TYPE_SBUTTON:"data-sbuttont",TRENDING:"0",POPULAR:"1",TOP_RATED:"2",DISCOVER:"3",DOMCollButtonOnclick(w){var f=w.parentElement.lastElementChild;const A=w.parentElement.children[1],k=w.parentElement.children[2];var q=w.getAttribute(z.TYPE_SBUTTON),b=f.clientWidth-f.clientWidth*6/100;if(f.scrollLeft-b<=0)A.setAttribute("data-display","0");else A.setAttribute("data-display","1");if(q==="0"){if(f.scrollBy(-b,0),f.scrollLeft-b<=0)A.setAttribute("data-display","0");k.setAttribute("data-display","1")}else{if(f.scrollBy(b,0),f.scrollLeft+b>=f.scrollWidth-f.clientWidth)k.setAttribute("data-display","0");A.setAttribute("data-display","1")}},createDOMCollection(w,f,A,k,q,b){var J=b.children[1].cloneNode(!0),K=b.children[2],H=J.children[0];if(H.insertAdjacentText("beforeend",w),k===z.TRENDING)H.setAttribute("href",`${window.location.origin}/trending?${x.Route.Q_MEDIA_TYPE}=${A}`);else if(k===z.POPULAR)H.setAttribute("href",`${window.location.origin}/popular?${x.Route.Q_MEDIA_TYPE}=${A}`);else if(k===z.TOP_RATED)H.setAttribute("href",`${window.location.origin}/top_rated?${x.Route.Q_MEDIA_TYPE}=${A}`);else if(k===z.DISCOVER){if(q!==void 0)H.setAttribute("href",`${window.location.origin}/discover?${x.Route.Q_MEDIA_TYPE}=${A}&${x.Route.Q_GENRE}=${q}&${x.Route.Q_TITLE}=${encodeURIComponent(w)}`)}for(var N of f){const U=x.Item.createDOMItem(N,A,K);J.lastElementChild.appendChild(U)}return J}},V={async discover(w,f,A,k,q,b,J){var K=await w;if(console.info(f,K),K?.results===void 0||K.results.length===0)throw Error("API.getTopRated does not have data");var H=z.createDOMCollection(f,K.results,A,z.DISCOVER,k,J.templateCollection.content),N=J.view.children[b+q];N.insertAdjacentElement("beforebegin",H),N.remove()},onclick(w,f,A){var k=w.getAttribute("data-type");if(k===Q.COLL_BUTTON)z.DOMCollButtonOnclick(w);else if(k===x.TYPE.ITEM){A.preventDefault();var q=w.getAttribute("data-media"),b=w.getAttribute("data-id");if(q!==null&&b!==null)x.Modal.open(q,b,f,!0);else console.error("View onclick bad mediaType or id")}}},X={TYPE:Q,Collection:z,View:V};export{X as default};