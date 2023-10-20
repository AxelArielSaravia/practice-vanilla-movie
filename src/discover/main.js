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
    var qtitle = url.searchParams.get(_.Route.Q_TITLE);
    var qmediaType = url.searchParams.get(_.Route.Q_MEDIA_TYPE);
    var qgenre = url.searchParams.get(_.Route.Q_GENRE);
    var qcrew = url.searchParams.get(_.Route.Q_MEDIA_TYPE);
    var qcast = url.searchParams.get(_.Route.Q_MEDIA_TYPE);
    var qcompany = url.searchParams.get(_.Route.Q_MEDIA_TYPE);

    if (qmediaType === null) {
        throw Error("Bad Route");
    }

    if (qtitle !== null) {
        DOM.main.firstElementChild.textContent = qtitle;
    }

    if (qgenre !== null) {
        _.API.getDiscover(
            /*mediatype*/   qmediaType,
            /*page*/        "1",
            /*genre*/       qgenre,
            /*cast*/        undefined,
            /*crew*/        undefined,
            /*company*/     undefined
        ).then(console.info);
    } else if (qcast !== null) {
        _.API.getDiscover(
            /*mediatype*/   qmediaType,
            /*page*/        "1",
            /*genre*/       undefined,
            /*cast*/        qcast,
            /*crew*/        undefined,
            /*company*/     undefined
        ).then(console.info);
    } else if (qcrew !== null) {
        _.API.getDiscover(
            /*mediatype*/   qmediaType,
            /*page*/        "1",
            /*genre*/       undefined,
            /*cast*/        undefined,
            /*crew*/        qcrew,
            /*company*/     undefined
        ).then(console.info);
    } else if (qcompany !== null) {
        _.API.getDiscover(
            /*mediatype*/   qmediaType,
            /*page*/        "1",
            /*genre*/       undefined,
            /*cast*/        undefined,
            /*crew*/        undefined,
            /*company*/     qcompany
        ).then(console.info);
    } else {
        throw Error("Bad Route");
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
