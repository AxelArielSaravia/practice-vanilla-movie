import G from "../general.js";

const State = {
    fragment: document.createDocumentFragment(),
    maxPages: 0,
    page: 3,
    ended: false,
};
const DOMSkeletons = Array(6);

async function addItems(dataPromise, DOM) {
    var data;
    try {
        data = await dataPromise;
    } catch {
        State.ended = true;
        DocumentFragment.prototype.replaceChildren.apply(
            DOM.templateSkeleton.content,
            DOMSkeletons
        );
        return;
    }
    if (data?.results === undefined || data.results.length === 0) {
        State.ended = true;
        DocumentFragment.prototype.replaceChildren.apply(
            DOM.templateSkeleton.content,
            DOMSkeletons
        );
        return;
    }
    var mediaType = "";
    var DOMItem;
    for (var dataItem of data.results) {
        mediaType = dataItem.media_type;
        if (mediaType === "movie" || mediaType === "tv") {
            DOMItem = G.Item.createDOMItem(
                dataItem,
                mediaType,
                DOM.templateItem?.content?.firstElementChild
            );
            State.fragment.appendChild(DOMItem);
        }
    }
    DocumentFragment.prototype.replaceChildren.apply(
        DOM.templateSkeleton.content,
        DOMSkeletons
    );
    DOM.view.appendChild(State.fragment);
    DOM.buttonMore.setAttribute("data-display", "1");
}

window.addEventListener("DOMContentLoaded", function () {
    var DOM = {
        //template
        templateSkeleton: document.getElementById("template_skeleton"),
        templateItem: document.getElementById("template_item"),
        templateModal: document.getElementById("template_modal"),
        //header
        headerPNav: document.getElementById("header_p_nav"),
        headerSearch: document.getElementById("header_search"),
        headerButtonTheme: document.getElementById("header_button-theme"),
        //main
        main: document.getElementById("main"),
        view: document.getElementById("view"),
        buttonMore: document.getElementById("button-more"),
        //modal
        modal: document.getElementById("modal")
    };
    if (DOM.templateSkeleton === null) {
        throw Error("DOM.templateSkeleton is null");
    }
    if (DOM.templateItem === null) {
        throw Error("DOM.templateItem is null");
    }
    if (DOM.templateModal === null) {
        throw Error("DOM.templateModal is null");
    }
    if (DOM.headerPNav === null) {
        throw Error("DOM.headerPNav is null");
    }
    if (DOM.headerSearch === null) {
        throw Error("DOM.headerSearch is null");
    }
    if (DOM.headerButtonTheme === null) {
        throw Error("DOM.headerButtonTheme is null");
    }
    if (DOM.main === null) {
        throw Error("DOM.main is null");
    }
    if (DOM.view === null) {
        throw Error("DOM.view is null");
    }
    if (DOM.buttonMore === null) {
        throw Error("DOM.buttonMore is null");
    }
    if (DOM.modal === null) {
        throw Error("DOM.modal is null");
    }
    G.Route.url.href = window.location.href;
    var url = G.Route.url;
    var qsearch = url.searchParams.get(G.Route.Q_SEARCH);

    if (qsearch !== null) {
        DOM.main.firstElementChild.textContent += ` ${qsearch}`;
    } else {
        window.open("./404.html", "_self", "noopener,noreferrer");
        return;
    }

    DOMSkeletons[0] = DOM.view.children[0];
    DOMSkeletons[1] = DOM.view.children[1];
    DOMSkeletons[2] = DOM.view.children[2];
    DOMSkeletons[3] = DOM.view.children[3];
    DOMSkeletons[4] = DOM.view.children[4];
    DOMSkeletons[5] = DOM.view.children[5];

    //Theme
    G.Theme.init();

    //Route
    G.Route.href = `${G.Route.href}?${G.Route.Q_SEARCH}=${qsearch}`;
    G.Route.hrefq = `${G.Route.href}&`;
    G.Route.init(DOM);

    //Events
    window.addEventListener("popstate", function () {
        G.Route.onpopstate(DOM);
    });

    DOM.headerButtonTheme.setAttribute("data-type", G.Theme.current);
    DOM.headerButtonTheme.addEventListener("click", G.Theme.onclick);

    DOM.headerPNav.firstElementChild.addEventListener("click", G.Nav.buttonNavOnclick);
    DOM.headerPNav.lastElementChild.addEventListener("focusout", G.Nav.navOnfocusout);

    DOM.headerSearch.children[1].addEventListener("click", function (e) {
        DOM.headerSearch.reset();
    });

    DOM.buttonMore.addEventListener("click", function () {
        DOM.buttonMore?.setAttribute("data-display", "0");
        if (State.ended) {
            return;
        }
        DOM.view.appendChild(DOM.templateSkeleton.content);
        addItems(
            G.API.getSearch(qsearch, String(State.page)),
            DOM
        );
        State.page += 1;
    });

    DOM.view.addEventListener("click", function (e) {
        var target = e.target;
        var type = target.getAttribute("data-type");
        if (type === G.TYPE.ITEM) {
            e.preventDefault();
            var mediaType = target.getAttribute("data-media");
            var id = target.getAttribute("data-id");
            if (id !== null) {
                G.Modal.open(
                    /*mediaType*/   mediaType,
                    /*id*/          id,
                    /*DOM*/         DOM,
                    /*changeRoute*/ true
                );
            }
        }
    });

    DOM.modal.addEventListener("click", function (e) {
        G.Modal.onclick(e.target, DOM);
    });

    DOM.modal.addEventListener("change", function (e) {
        G.Modal.onchange(e.target, DOM);
    });

    //Data
    var searchPromise = G.API.getSearch(qsearch, "1");
    var searchPromise2 = G.API.getSearch(qsearch, "2");

    searchPromise.then(function (data) {
        if (data?.results === undefined || data.results.length === 0) {
            State.ended = true;
            DOM.main.children[1].setAttribute("data-display", "1");
        } else {
            var mediaType = "";
            var DOMItem;
            for (var dataItem of data.results) {
                mediaType = dataItem.media_type;
                if (mediaType === "movie" || mediaType === "tv") {
                    DOMItem = G.Item.createDOMItem(
                        dataItem,
                        mediaType,
                        DOM.templateItem?.content?.firstElementChild
                    );
                    State.fragment.appendChild(DOMItem);
                }
            }
        }
        DocumentFragment.prototype.replaceChildren.apply(
            DOM.templateSkeleton.content,
            DOMSkeletons
        );
        DOM.view.appendChild(State.fragment);
        searchPromise = null;
    });
    searchPromise2.then(function (data) {
        if (data?.results === undefined || data.results.length === 0) {
            State.ended = true;
            return;
        }
        var mediaType = "";
        var DOMItem;
        for (var dataItem of data.results) {
            mediaType = dataItem.media_type;
            if (mediaType === "movie" || mediaType === "tv") {
                DOMItem = G.Item.createDOMItem(
                    dataItem,
                    mediaType,
                    DOM.templateItem?.content?.firstElementChild
                );
                State.fragment.appendChild(DOMItem);
            }
        }
        DOM.view.appendChild(State.fragment);
        DOM.buttonMore?.setAttribute("data-display", "1");
        searchPromise2 = null;
    });
});
