import _ from "../general.js";

const Q_MEDIA_TYPE = "t";
const Q_COLLECTION_TYPE = "c";
const Q_GENRE = "g";
const Q_CREW = "cr";
const Q_CAST = "ca";
const Q_COMPANY = "co";

async function DOMMainFill(promiseData, title, DOMMain) {
    const data = await promiseData;
    console.info(data);
    if (data.results === undefined || data.results.length === 0) {
        throw Error("promise does not have data");
    }
    DOMMain.firstElementChild.textContent = title;
}

window.addEventListener("DOMContentLoaded", function () {
    var DOM = {
        //template
        templateSkeleton: document.getElementById("template_skeleton"),
        templateItem: document.getElementById("template_Item"),
        templateModal: document.getElementById("template_modal"),
        //header
        headerPNav: document.getElementById("header_p_nav"),
        headerButtonSearch: document.getElementById("header_button-search"),
        headerButtonTheme: document.getElementById("header_button-theme"),
        //main
        main: document.getElementById("main"),
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
    if (DOM.headerButtonSearch === null) {
        throw Error("DOM.headerButtonSearch is null");
    }
    if (DOM.headerButtonTheme === null) {
        throw Error("DOM.headerButtonTheme is null");
    }
    if (DOM.main === null) {
        throw Error("DOM.main is null");
    }
    if (DOM.buttonMore === null) {
        throw Error("DOM.buttonMore is null");
    }
    if (DOM.modal === null) {
        throw Error("DOM.modal is null");
    }

    {
        _.Route.url.href = window.location.href;
        const url = _.Route.url;
        const qmt = url.searchParams.get(Q_MEDIA_TYPE);
        const qct = url.searchParams.get(Q_COLLECTION_TYPE);
        const qg = url.searchParams.get(Q_GENRE);
        const qcr = url.searchParams.get(Q_CREW);
        const qca = url.searchParams.get(Q_CAST);
        const qco = url.searchParams.get(Q_COMPANY);
        if (
            qmt == null
            || qct == null
            || (qmt !== "tv" && qmt !== "movie" && qmt !== "all")
        ) {
            window.open(window.location.origin,"_self","noreferer,noopener");
            return;
        }
        let title = "";
        if (qct === _.Collection.TRENDING) {
            if (qmt === "tv") {
                title = "Tv Series Week Trendings"
            } else if (qmt === "movie") {
                title = "Movies Week Trendings"
            } else {
                title = "Week Trendings"
            }
            DOMMainFill(
                _.API.getTrending(qmt, "1"),
                title,
                DOM.main
            );
        } else if (qct === _.Collection.POPULAR && qmt !== "all") {
            if (qmt === "movie") {
                title = "Popular Movies"
            } else {
                title = "Popular Tv Series"
            }
            DOMMainFill(
                _.API.getPopular(qmt, "1"),
                title,
                DOM.main
            );
        } else if (qct === _.Collection.TOP_RATED && qmt !== "all") {
            if (qmt === "movie") {
                title = "Top Rated Movies"
            } else {
                title = "Top Rated Tv Series"
            }
            DOMMainFill(
                _.API.getTopRated(qmt, "1"),
                title,
                DOM.main
            );
        } else if (qct === _.Collection.DISCOVER && qmt !== "all") {
            if (qg !== null) {
                if (qmt === "movie") {
                    title = `${qg} Movies`
                } else {
                    title = `${qg} Tv Series`
                }
                let p = _.API.getDiscover(
                    /*mediatype*/   qmt,
                    /*page*/        "1",
                    /*genre*/       qg,
                    /*cast*/        undefined,
                    /*crew*/        undefined,
                    /*company*/     undefined
                );
                DOMMainFill(p, title, DOM.main);
            } else if (qca !== null) {
                title = `${qca} Movies`;
                let p = _.API.getDiscover(
                    /*mediatype*/   qmt,
                    /*page*/        "1",
                    /*genre*/       undefined,
                    /*cast*/        qca,
                    /*crew*/        undefined,
                    /*company*/     undefined
                );
                DOMMainFill(p, title, DOM.main);
            } else if (qcr !== null) {
                title = `${qcr} Movies`;
                let p = _.API.getDiscover(
                    /*mediatype*/   qmt,
                    /*page*/        "1",
                    /*genre*/       undefined,
                    /*cast*/        undefined,
                    /*crew*/        qcr,
                    /*company*/     undefined
                );
                DOMMainFill(p, title, DOM.main);
            } else if (qco !== null) {
                if (qmt === "movie") {
                    title = `${qco} Movies`
                } else {
                    title = `${qco} Tv Series`
                }
                let p = _.API.getDiscover(
                    /*mediatype*/   qmt,
                    /*page*/        "1",
                    /*genre*/       undefined,
                    /*cast*/        undefined,
                    /*crew*/        undefined,
                    /*company*/     qco
                );
                DOMMainFill(p, title, DOM.main);
            } else {
                window.open(window.location.origin,"_self","noreferer,noopener");
                return;
            }
        } else {
            window.open(window.location.origin,"_self","noreferer,noopener");
            return;
        }
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
});
