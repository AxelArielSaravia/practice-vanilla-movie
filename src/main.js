import _ from "./general.js";

const CollectionState = {
    MAX: 15,
    STEPS: 5,
    len: 0,
    count: 7,
    itv: 0,
    tvGenres: null,
    imov: 0,
    movieGenres: null,
};

function collectionsFill(DOM) {
    /** @type {"movie" | "tv"}*/
    var mediaType;
    /** @type {number}*/
    var genre;
    /** @type {string}*/
    var genreName;
    /** @type {string}*/
    var title;
    var movieGenres = CollectionState.movieGenres;
    var tvGenres = CollectionState.tvGenres;
    var itv = CollectionState.itv;
    var imov = CollectionState.imov;
    var select = 0;

    DOM.buttonMore?.setAttribute("data-display", "0");

    var end = 0;
    var full = false;
    if (CollectionState.count + CollectionState.STEPS < CollectionState.len) {
        end = CollectionState.count + CollectionState.STEPS;
    } else {
        end = CollectionState.len;
        full = true;
    }
    for (var i = CollectionState.count; i < end; i += 1) {
        var DOMSkeleton = (
            DOM.templateCollection.content.children[0].cloneNode(true)
        );
        DOM.view?.appendChild(DOMSkeleton);
    }

    for (var i = CollectionState.count; i < end; i += 1) {
        if (itv < tvGenres.length && imov < movieGenres.length) {
            if (Math.random() < 0.5) {
                select = 1;
            }
        } else if (tv < tvGenres.length) {
            select = 1;
        }

        if (select === 0) {
            genre = movieGenres[imov].id;
            genreName = movieGenres[imov].name;
            mediaType = "movie";
            title = `${genreName} Movies`;
            imov += 1;
            CollectionState.imov += 1;
        } else {
            genre = tvGenres[itv].id;
            genreName = tvGenres[itv].name;
            mediaType = "tv";
            title = `${genreName} Tv series`;
            itv += 1;
            CollectionState.itv += 1;
        }
        CollectionState.count += 1;
        _.View.discover(
            _.API.getDiscover(mediaType, genre, "1"),
            title,
            mediaType,
            i,
            DOM.view.children.length - end,
            DOM
        );
    }
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
        headerButtonNav: document.getElementById("header_button-nav"),
        headerNav: document.getElementById("header_nav"),
        headerButtonSearch: document.getElementById("header_button-search"),
        headerButtonTheme: document.getElementById("header_button-theme"),
        //main
        main: document.getElementById("main"),
        hero: document.getElementById("hero"),
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
    if (DOM.headerButtonNav === null) {
        throw Error("DOM.headerButtonNav is null");
    }
    if (DOM.headerNav === null) {
        throw Error("DOM.headerNav is null");
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

    DOM.headerButtonNav.addEventListener("click", _.Nav.buttonNavOnclick);
    DOM.headerNav.addEventListener("focusout", _.Nav.navOnfocusout);

    DOM.view.addEventListener("click", function (e) {
        _.View.onclick(e.target, DOM);
    });

    DOM.hero.lastElementChild.addEventListener("click", function (e) {
        _.Hero.DOMTitleOnclick(e.target, DOM);
    });

    DOM.modal.addEventListener("click", function (e) {
        _.Modal.onclick(e.target, DOM);
    });

    DOM.modal.addEventListener("change", function (e) {
        _.Modal.onchange(e.target, DOM);
    });

    DOM.buttonMore.addEventListener("click", function (e) {
        collectionsFill(DOM);
    });

    //Data
    var trendingPromise = _.API.getTrending("all", "1");
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
        var DOMColl = _.View.createDOMCollection(
            /*header*/          "Week Trendings",
            /*data*/            data.results,
            /*mediaType*/       undefined,
            /*DFCollection*/  DOM.templateCollection.content,
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
        var DOMColl = _.View.createDOMCollection(
            /*header*/          "Popular Movies",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*DFCollection*/    DOM.templateCollection.content,
        );
        var DOMPos1 = DOM.view.children[1];
        DOMPos1.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos1.remove();
    });

    _.API.getPopular("tv", "1").then(function (data) {
        console.info("getPopular tv", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getDiscover does not have data");
        }
        var DOMColl = _.View.createDOMCollection(
            /*header*/          "Popular Tv series",
            /*data*/            data.results,
            /*mediaType*/       "tv",
            /*DFCollection*/    DOM.templateCollection.content,
        );
        var DOMPos2 = DOM.view.children[2];
        DOMPos2.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos2.remove();
    });

    _.API.getTopRated("movie", "1").then(function (data) {
        console.info("getTopRate movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        var DOMColl = _.View.createDOMCollection(
            /*header*/          "Top rated movie",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*DFCollection*/    DOM.templateCollection.content,
        );
        var DOMPos3 = DOM.view.children[3];
        DOMPos3.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos3.remove();
    });

    _.API.getTopRated("tv", "1").then(function (data) {
        console.info("getTopRate tv", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        var DOMColl = _.View.createDOMCollection(
            /*header*/          "Top rated tv serie",
            /*data*/            data.results,
            /*mediaType*/       "tv",
            /*DFCollection*/  DOM.templateCollection.content,
        );
        var DOMPos4 = DOM.view.children[4];
        DOMPos4.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos4.remove();
    });

    var movieGenreList = _.API.getGenres("movie");
    var tvGenreList = _.API.getGenres("tv");
    Promise.all([movieGenreList,tvGenreList]).then(function (data) {
        console.info("movie genres", data[0]);
        console.info("tv genres", data[1]);
        if (data[0] === undefined
            || data[0].genres === undefined
            || data[0].genres.length === 0
        ) {
            throw Error("API.getGenre does not have data");
        }
        if (data[1] === undefined
            || data[1].genres === undefined
            || data[1].genres.length === 0
        ) {
            throw Error("API.getGenre does not have data");
        }
        var movieGenres = data[0].genres;
        var tvGenres = data[1].genres;
        CollectionState.tvGenres = tvGenres;
        CollectionState.movieGenres = movieGenres;

        if (movieGenres.length + tvGenres.length < CollectionState.MAX) {
            CollectionState.len = movieGenres.length + tvGenres.length;
        } else {
            CollectionState.len = CollectionState.MAX;
        }
        console.info("Collection:", CollectionState)

        DOM.buttonMore?.setAttribute("data-display", "1");

        if (movieGenres.length > 1) {
            _.Utils.randomPermutation(movieGenres);
        }
        if (tvGenres.length > 1) {
            _.Utils.randomPermutation(tvGenres)
        }

        /** @type {"movie" | "tv"}*/
        var mediaType;
        /** @type {number}*/
        var genre;
        /** @type {string}*/
        var genreName;
        /** @type {string}*/
        var title;
        var imov = 0;
        var itv = 0;
        for (let i = 0; i < 2; i += 1) {
            if (Math.random() < 0.5) {
                genre = movieGenres[imov].id;
                genreName = movieGenres[imov].name;
                mediaType = "movie";
                title = `${genreName} Movies`;
                imov += 1;
                CollectionState.imov += 1;
            } else {
                genre = tvGenres[itv].id;
                genreName = tvGenres[itv].name;
                mediaType = "tv";
                title = `${genreName} Tv series`;
                itv += 1;
                CollectionState.itv += 1;
            }
            _.View.discover(
                _.API.getDiscover(mediaType, genre, "1"),
                title,
                mediaType,
                i,
                5,
                DOM
            );
        }
    });
});
