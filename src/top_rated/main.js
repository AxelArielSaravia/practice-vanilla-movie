import _ from "../general.js";

window.addEventListener("DOMContentLoaded", function () {
    var DOM = {
        //template
        templateSkeleton: document.getElementById("template_skeleton"),
        templateItem: document.getElementById("template_item"),
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
    _.Route.url.href = window.location.href;
    var url = _.Route.url;
    var qmediaType = url.searchParams.get(_.Route.Q_MEDIA_TYPE);
    if (qmediaType === "tv") {
        DOM.main.firstElementChild.textContent += " Tv Series";
    } else if (qmediaType === "movie") {
        DOM.main.firstElementChild.textContent += " Movies";
    } else {
        throw Error("Bad Route");
    }

    _.API.getTopRated(qmediaType, "1").then(console.info);

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
