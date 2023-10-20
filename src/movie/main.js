import _ from "../general.js";

const CollectionState = {
    STEPS: 5,
    len: 0,
    count: 3,
    index: 0,
    genres: null,
};

/**
@type {(
    DOM: DOM_T,
    collections: number,
    addSkeleton: boolean
) => undefined} */
function collectionsFill(DOM, collections, addSkeleton) {
    /** @type {number}*/
    var genre;
    /** @type {string}*/
    var genreName;
    /** @type {string}*/
    var title;
    var genres = CollectionState.genres;
    var index = CollectionState.index;

    DOM.buttonMore?.setAttribute("data-display", "0");

    var end = 0;
    var full = false;
    if (CollectionState.count + collections < CollectionState.len) {
        end = CollectionState.count + collections;
    } else {
        end = CollectionState.len;
        full = true;
    }
    if (addSkeleton) {
        for (var i = CollectionState.count; i < end; i += 1) {
            var DOMSkeleton = (
                DOM.templateCollection.content.children[0].cloneNode(true)
            );
            DOM.view?.appendChild(DOMSkeleton);
        }
    }

    var base = DOM.view.children.length - end;
    var c = CollectionState.count;
    while (c < end) {
        genre = genres[index].id;
        genreName = genres[index].name;
        title = `${genreName} Movies`;
        _.View.discover(
            _.API.getDiscover(
                /*mediaType*/   "movie",
                /*page*/        "1",
                /*genre*/       genre,
                /*cast*/        undefined,
                /*crew*/        undefined,
                /*company*/     undefined
            ),
            title,
            "movie",
            genre,
            c,
            base,
            DOM
        );
        index += 1;
        c += 1;
    }
    CollectionState.index = index;
    CollectionState.count = c;

    if (!full) {
        DOM.buttonMore?.setAttribute("data-display", "1");
    }
}

window.addEventListener("DOMContentLoaded", function () {
    var DOM = {
        //template
        templateCollection: document.getElementById("template_collection"),
        templateModal: document.getElementById("template_modal"),
        //header
        headerPNav: document.getElementById("header_p_nav"),
        headerButtonSearch: document.getElementById("header_button-search"),
        headerButtonTheme: document.getElementById("header_button-theme"),
        //main
        main: document.getElementById("main"),
        hero: document.getElementById("hero"),
        heroTitle: document.getElementById("hero-title"),
        view: document.getElementById("view"),
        buttonMore: document.getElementById("button-more"),

        modal: document.getElementById("modal")
    };

    if (DOM.templateCollection === null) {
        throw Error("DOM.templateCollection is null");
    }
    if (DOM.templateModal === null) {
        throw Error("DOM.templateModal is null");
    }
    if (DOM.headerPNav === null) {
        throw Error("DOM.headerPNav is null");
    }
    if (DOM.headerButtonSearch === null) {
        throw Error("DOM.headerButtonSearch is null");
    }
    if (DOM.headerButtonTheme === null) {
        throw Error("DOM.headerButtonTheme is null");
    }
    if (DOM.main === null) {
        throw Error("DOM.main is null");
    }
    if (DOM.hero === null) {
        throw Error("DOM.hero is null");
    }
    if (DOM.heroTitle === null) {
        throw Error("DOM.heroTitle is null");
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

    //Theme
    _.Theme.init();

    //Route
    _.Route.init(DOM);

    //Events
    window.addEventListener("popstate", function () {
        _.Route.onpopstate(DOM);
    });

    DOM.headerButtonTheme.setAttribute("data-type", _.Theme.current);
    DOM.headerButtonTheme.addEventListener("click", _.Theme.onclick);

    DOM.headerPNav.firstElementChild.addEventListener("click", _.Nav.buttonNavOnclick);
    DOM.headerPNav.lastElementChild.addEventListener("focusout", _.Nav.navOnfocusout);

    DOM.view.addEventListener("click", function (e) {
        _.View.onclick(e.target, DOM, e);
    });

    DOM.heroTitle.addEventListener("click", function (e) {
        _.Hero.DOMTitleOnclick(e.target, DOM, e);
    });

    DOM.modal.addEventListener("click", function (e) {
        _.Modal.onclick(e.target, DOM);
    });

    DOM.modal.addEventListener("change", function (e) {
        _.Modal.onchange(e.target, DOM);
    });

    DOM.buttonMore.addEventListener("click", function () {
        collectionsFill(DOM, CollectionState.STEPS, true);
    });

    //Data

    var tvGenreList = _.API.getGenres("movie");

    var trendingPromise = _.API.getTrending("movie", "1");
    trendingPromise.then(function (data) {
        console.info("trending: ", data);
    });

    var heroPromise = trendingPromise.then(_.Hero.selectHero);
    heroPromise.then(function (data) {
        console.info("hero: ", data);
    });

    heroPromise.then(_.Hero.getHeroLogo).then(function (data) {
        _.Hero.initDOMImgLogo(data, DOM.hero);
    });

    heroPromise.then(function (data) {
        if (data !== undefined) {
           _.Hero.initDOM(data, DOM.hero);
        }
    });

    trendingPromise.then(function (data) {
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTrending does not have data");
        }
        var DOMColl = _.Collection.createDOMCollection(
            /*header*/          "Week Trendings",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*collectionType*/  _.Collection.TRENDING,
            /*genre*/           undefined,
            /*DFCollection*/    DOM.templateCollection.content,
        );
        var DOMPos0 = DOM.view.children[0];
        DOMPos0.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos0.remove();
    });

    _.API.getPopular("movie", "1").then(function (data) {
        console.info("getPopular movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getDiscover does not have data");
        }
        var DOMColl = _.Collection.createDOMCollection(
            /*header*/          "Popular Movies",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*collectionType*/  _.Collection.POPULAR,
            /*genre*/           undefined,
            /*DFCollection*/    DOM.templateCollection.content,
        );
        var DOMPos1 = DOM.view.children[1];
        DOMPos1.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos1.remove();
    });

    _.API.getTopRated("movie", "1").then(function (data) {
        console.info("getTopRate movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        var DOMColl = _.Collection.createDOMCollection(
            /*header*/          "Top Rated Movies",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*collectionType*/  _.Collection.TOP_RATED,
            /*genre*/           undefined,
            /*DFCollection*/  DOM.templateCollection.content,
        );
        var DOMPos2 = DOM.view.children[2];
        DOMPos2.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos2.remove();
    });

    tvGenreList.then(function (data) {
        if (
            data === undefined
            || data.genres === undefined
            || data.genres.length === 0
        ) {
            throw Error("API.getGenre does not have data");
        }
        CollectionState.genres = data.genres;
        CollectionState.len = data.genres.length;
        _.Utils.randomPermutation(CollectionState.genres);
        collectionsFill(DOM, 4, false);
    });
});
