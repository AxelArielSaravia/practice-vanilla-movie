import API from "./api.js";
import * as utils from "./utils.js";

const TYPE = {
    /**
    @type {"0"}*/
    NAV_LINK: "0",
    /**
    @type {"4"}*/
    COLL_TITLE: "4",
    /**
    @type {"5"}*/
    COLL_BUTTON: "5",
};

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

const MEDIA = {
    pointerFine: window.matchMedia("(pointer: fine)"),
}

const Theme = {
    /**
    @type {ThemeColor}*/
    current: "dark",
    /**
    @type {"dark"}*/
    DARK: "dark",
    /**
    @type {"light"}*/
    LIGHT: "light",
    init() {
        var t = localStorage.getItem("theme");
        if (t === "dark" || t === "light") {
            Theme.current = t;
        } else {
            if (
                window.matchMedia !== undefined
                && window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                Theme.current = Theme.DARK;
            } else {
                Theme.current = Theme.LIGHT;
            }
            localStorage.setItem("theme", Theme.current);
        }
        //html tag
        document.firstElementChild?.setAttribute("class", Theme.current);
    },
    /**
    @type {(t: ThemeColor) => undefined}*/
    change(t) {
        localStorage.setItem("theme", t);
        document.firstElementChild?.setAttribute("class", Theme.current);
    },
    onclick(e) {
        /**@type {HTMLButtonElement | null}*/
        var DOMThemeButton = e.currentTarget;
        if (DOMThemeButton === null) {
            return;
        }
        if (Theme.current === Theme.DARK) {
            Theme.current = Theme.LIGHT;
        } else {
            Theme.current = Theme.DARK;
        }
        DOMThemeButton.setAttribute("data-type", Theme.current);
        Theme.change(Theme.current);
    }
};

const NavMethods = {
    ATTR_SHOW: "data-mbshow",
    ATTR_SELECTED: "data-selected",
    ATTR_LINK_TYPE: "data-linkt",
    HIDDEN: "0",
    SHOW: "1",
    //Toggle nav menu on header_button-nav onclick
    buttonNavOnclick(e) {
        console.info(e);
        /**@type {HTMLButtonElement}*///This will crash if is null
        var DOMButtonNav = e.currentTarget;
        /**@type {HTMLUListElement}*///This will crash if is null
        var DOMNav = DOMButtonNav.nextElementSibling;
        if (DOMNav.getAttribute(NavMethods.ATTR_SHOW) === NavMethods.HIDDEN) {
            DOMNav.setAttribute(NavMethods.ATTR_SHOW, NavMethods.SHOW);
            //First nav-link element
            DOMNav.firstElementChild.firstElementChild.focus();
        } else {
            DOMNav.setAttribute(NavMethods.ATTR_SHOW, NavMethods.HIDDEN);
        }
    },
    //hidde nav menu if the focus is out of the nav menu of the 
    navOnfocusout(e) {
        var relatedTarget = e.relatedTarget;
        if (
            relatedTarget === null
            || relatedTarget.getAttribute("data-type") !== TYPE.NAV_LINK
        ) {
            /**@type {HTMLUListElement}*///This will crash if is null
            var DOMNav = e.currentTarget;
            DOMNav.setAttribute(
                NavMethods.ATTR_SHOW,
                NavMethods.HIDDEN
            );
        }
    },
    navOnclick(e) {
        var target = e.target;
        if (target.getAttribute("data-type") === TYPE.NAV_LINK) {
            var type = target.getAttribute(NavMethods.ATTR_LINK_TYPE);
            /**@type {HTMLUListElement}*///This will crash if is null
            var DOMNav = e.currentTarget;
            /**@type {HTMLButtonElement}*///This will crash if is null
            var DOMButtonNav = DOMNav.previousElementSibling;
            DOMButtonNav.replaceChildren();
            DOMButtonNav.insertAdjacentText("beforeend", target.textContent);
            DOMNav.setAttribute(NavMethods.ATTR_SHOW, NavMethods.HIDDEN);
            DOMNav.setAttribute(NavMethods.ATTR_SELECTED, type);
            e.preventDefault();
        }
    }
};

const HeroMethods = {
    /**
    @type {(trendings: Array<MDBTrending>) => MDBTrending}*/
    select(trendings) {
        return trendings[utils.random(trendings.length)];
    },
    //Select a random trending movie or tv serie
    /**
    @type {(trending: maybe<MDBResponse<MDBTrending>>) => never | maybe<HeroItem>}*/
    selectHero(trending) {
        if (trending) {
            if (!trending.results || trending.results.length === 0) {
                throw Error("trending.results does not have data");
            }
            return HeroMethods.select(trending.results);
        }
    },
    /**
    @type {(hero: maybe<HeroItem>) => Promise<maybe<string>>}*/
    async getHeroLogo(hero) {
        if (hero === undefined) {
            return;
        }
        var id = hero.id;
        var mediaType = hero.media_type;
        var images = await API.getImages(id, mediaType);
        //we assume that must exist some logo
        if (images.logos.length > 0) {
            return images.logos[0].file_path;
        } else {
            return undefined;
        }
    },
    /**
    @type {(path: string, DOMHero: HTMLDivElement) => undefined}*/
    initDOMImgLogo(path, DOMHero) {
        /**@type {HTMLElement}*/
        var DOMLogo = (
            DOMHero
            .lastElementChild
            .firstElementChild
        );
        if (path) {
            DOMLogo.lastElementChild.setAttribute("data-display", "1");
            DOMLogo.lastElementChild.setAttribute(
                "src",
                `https://image.tmdb.org/t/p/w300${path}`
            );
        } else {
            DOMLogo.firstElementChild.setAttribute("data-display", "1");
        }
    },
    /**
    @type {(hero: HeroItem, DOMHero: HTMLDivElement) => undefined}*/
    initDOM(hero, DOMHero) {
        /**@type {HTMLImageElement}*/
        var DOMImgBg = DOMHero.firstElementChild.firstElementChild;
        /**@type {HTMLElement}*/
        var DOMInfo = DOMHero.lastElementChild;
        /**@type {HTMLElement}*/
        var DOMHLogo = DOMInfo.firstElementChild.firstElementChild;
        /**@type {HTMLParamElement}*/
        var DOMDescription = DOMInfo.children[2];

        DOMImgBg.setAttribute("data-display", "1");
        DOMImgBg.setAttribute(
            "src",
            `https://image.tmdb.org/t/p/w1280${hero.backdrop_path}`
        );
        DOMHLogo.textContent = hero.title;
        DOMDescription.textContent = hero.overview;
    }
};


const View = {
    TYPE_SBUTTON: "data-sbuttont",
    onclick(e) {
        /** @type {HTMLButtonElement | null}*/
        var target = e.target;
        if (target?.getAttribute("data-type") === TYPE.COLL_BUTTON) {
            /**@type {HTMLElement}*/
            var DOMSlider = target.parentElement.lastElementChild;
            /**@type {HTMLButtonElement}*/
            const DOMButtonL = target.parentElement.children[1];
            /**@type {HTMLButtonElement}*/
            const DOMButtonR = target.parentElement.children[2];
            var type = target.getAttribute(View.TYPE_SBUTTON);
            var scrollval = (
                DOMSlider.clientWidth
                - (
                    (DOMSlider.clientWidth * 6) / 100
                )
            );
            if (DOMSlider.scrollLeft - scrollval <= 0) {
                DOMButtonL.setAttribute("data-display", "0");
            } else {
                DOMButtonL.setAttribute("data-display", "1");
            }
            if (type === "0") {
                DOMSlider.scrollBy(-scrollval, 0);
                if (DOMSlider.scrollLeft - scrollval <= 0) {
                    DOMButtonL.setAttribute("data-display", "0");
                }
                DOMButtonR.setAttribute("data-display", "1");
            } else {
                DOMSlider.scrollBy(scrollval, 0);
                if (
                    DOMSlider.scrollLeft + scrollval
                    >= DOMSlider.scrollWidth - DOMSlider.clientWidth
                ) {
                    DOMButtonR.setAttribute("data-display", "0");
                }
                DOMButtonL.setAttribute("data-display", "1");
            }
        }
    },
}

/**
@type {(
    data: Promise<maybe<object>>,
    DOMItem: HTMLButtonElement,
    DOMTIcon: HTMLTemplateElement,
    backdropAlt: null | string,
) => Promise<undefined>}*/
async function setItemImage(dataP, DOMItem, DOMTIcon, backdropAlt) {
    var data = await dataP;
    if (data === undefined
        || data.backdrops === undefined
        || data.backdrops.length === 0
    ) {
        if (backdropAlt !== null && backdropAlt.length > 0) {
            var DOMImg = DOMItem.lastElementChild;
            DOMImg.setAttribute(
                "src",
                `https://image.tmdb.org/t/p/w400${backdropAlt}`
            );
            DOMImg.setAttribute("data-display", "1");

        } else {
            DOMItem.firstElementChild.setAttribute("data-display", "1");
            var DOMIVideo = DOMTIcon.content.firstElementChild?.cloneNode(true);
            DOMItem.appendChild(DOMIVideo);
        }
    } else {
        var backdrop = data.backdrops[0];
        /** @type {HTMLImageElement}*/
        var DOMImg = DOMItem.lastElementChild;
        DOMImg.setAttribute(
            "src",
            `https://image.tmdb.org/t/p/w400${backdrop.file_path}`
        );
        DOMImg.setAttribute("data-display", "1");
    }
}

/**
@type {(
    header: string,
    data: object,
    mediaType: "movie" | "tv" | undefined,
    DOMTCollection: HTMLTemplateElement,
    DOMTCollItem: HTMLTemplateElement,
    DOMTIcon: HTMLTemplateElement
) => HTMLElement}*/
function createDOMCollection(
    header,
    data,
    mediaType,
    DOMTCollection,
    DOMTCollItem,
    DOMTIcon
) {
    /**@type {HTMLTemplateElement}*/
    var DOMClone = DOMTCollection.content.cloneNode(true);
    /**@type {HTMLElement}*/
    var DOMCollection = DOMClone.firstElementChild;
    //DOMCollection.children[0].insertAdjacentText("beforeend", header);
    var DOMTitle = DOMCollection.children[0]
    DOMTitle.insertAdjacentText("beforeend", header);

    for (var dataItem of data) {
        /**@type {HTMLButtonElement}*/
        const DOMItem = DOMTCollItem.content.cloneNode(true).firstElementChild;
        DOMItem.setAttribute("data-id", dataItem.id);
        let itemTitle;
        /**@type {"movie"| "tv"} */
        let itemMediaType;
        if (mediaType !== undefined) {
            itemMediaType = mediaType;
        } else {
            itemMediaType = dataItem.media_type;
        }
        if (itemMediaType === "movie") {
            itemTitle = dataItem.title;
        } else {
            itemTitle = dataItem.name;
        }
        DOMItem.setAttribute("title", itemTitle);
        DOMItem.firstElementChild.insertAdjacentText("beforeend", itemTitle);
        DOMItem.lastElementChild.setAttribute("alt", itemTitle);
        setItemImage(
            API.getImages(dataItem.id, itemMediaType),
            DOMItem,
            DOMTIcon,
            dataItem.backdrop_path
        );
        DOMCollection.lastElementChild.appendChild(DOMItem);
    }
    return DOMCollection;
}

async function discover(DataPromise, title, mediaType, i, base, DOM) {
    var data = await DataPromise;
    console.info(title, data);
    if (data?.results === undefined || data.results.length === 0) {
        throw Error("API.getTopRated does not have data");
    }
    var DOMColl = createDOMCollection(
        /*header*/          title,
        /*data*/            data.results,
        /*mediaType*/       mediaType,
        /*DOMTCollection*/  DOM.templateCollection,
        /*DOMTCollItem*/    DOM.templateCollItem,
        /*DOMTIcon*/        DOM.templateIcons
    );
    var DOMPos = DOM.view.children[base + i];
    DOMPos.insertAdjacentElement("beforebegin", DOMColl);
    DOMPos.remove();
}



window.addEventListener("DOMContentLoaded", function () {
    var DOM = {
        //template
        templateCollection: document.getElementById("template_collection"),
        templateCollSkeleton: document.getElementById("template_collection-skeleton"),
        templateCollItem: document.getElementById("template_collection-item"),
        templateIcons: document.getElementById("template_icons"),
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
    };

    if (DOM.templateCollection === null) {
        throw Error("DOM.templateCollection is null");
    }
    if (DOM.templateCollSkeleton === null) {
        throw Error("DOM.templateCollSkeleton is null");
    }
    if (DOM.templateCollItem === null) {
        throw Error("DOM.templateCollItem is null");
    }
    if (DOM.templateIcons === null) {
        throw Error("DOM.templateIcons is null");
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

    Theme.init();

    DOM.headerButtonTheme.setAttribute("data-type", Theme.current);
    DOM.headerButtonTheme.addEventListener("click", Theme.onclick);

    DOM.headerButtonNav.addEventListener("click", NavMethods.buttonNavOnclick);
    DOM.headerNav.addEventListener("focusout", NavMethods.navOnfocusout);
    DOM.headerNav.addEventListener("click", NavMethods.navOnclick);


    if(MEDIA.pointerFine.matches) {
        DOM.view.onclick = View.onclick;
    }

    MEDIA.pointerFine.onchange = function (e) {
        if(e.matches) {
            DOM.view.onclick = View.onclick;
        } else {
            DOM.view.onclick = null;
        }
    }

    var trendingPromise = API.getTrending("1");
    trendingPromise.then(function (data) {
        console.info("trending: ", data);
    });

    var heroPromise = trendingPromise.then(HeroMethods.selectHero);
    heroPromise.then(function (data) {
        console.info("hero: ", data);
    });

    heroPromise.then(HeroMethods.getHeroLogo).then(function (data) {
        if (data !== undefined) {
            HeroMethods.initDOMImgLogo(data, DOM.hero);
        }
    });

    heroPromise.then(function (data) {
        if (data !== undefined) {
            HeroMethods.initDOM(data, DOM.hero);
        }
    });

    trendingPromise.then(function (data) {
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTrending does not have data");
        }
        var DOMColl = createDOMCollection(
            /*header*/          "Week Trendings",
            /*data*/            data.results,
            /*mediaType*/       undefined,
            /*DOMTCollection*/  DOM.templateCollection,
            /*DOMTCollItem*/    DOM.templateCollItem,
            /*DOMTIcon*/        DOM.templateIcons
        );
        var DOMPos0 = DOM.view.children[0];
        DOMPos0.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos0.remove();
    });

    API.getPopular("movie", "1").then(function (data) {
        console.info("getPopular movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getDiscover does not have data");
        }
        var DOMColl = createDOMCollection(
            /*header*/          "Popular Movies",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*DOMTCollection*/  DOM.templateCollection,
            /*DOMTCollItem*/    DOM.templateCollItem,
            /*DOMTIcon*/        DOM.templateIcons
        );
        var DOMPos1 = DOM.view.children[1];
        DOMPos1.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos1.remove();
    });

    API.getPopular("tv", "1").then(function (data) {
        console.info("getPopular tv", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getDiscover does not have data");
        }
        var DOMColl = createDOMCollection(
            /*header*/          "Popular Tv series",
            /*data*/            data.results,
            /*mediaType*/       "tv",
            /*DOMTCollection*/  DOM.templateCollection,
            /*DOMTCollItem*/    DOM.templateCollItem,
            /*DOMTIcon*/        DOM.templateIcons
        );
        var DOMPos2 = DOM.view.children[2];
        DOMPos2.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos2.remove();
    });

    API.getTopRated("movie", "1").then(function (data) {
        console.info("getTopRate movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        var DOMColl = createDOMCollection(
            /*header*/          "Top rated movie",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*DOMTCollection*/  DOM.templateCollection,
            /*DOMTCollItem*/    DOM.templateCollItem,
            /*DOMTIcon*/        DOM.templateIcons
        );
        var DOMPos3 = DOM.view.children[3];
        DOMPos3.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos3.remove();
    });

    API.getTopRated("tv", "1").then(function (data) {
        console.info("getTopRate tv", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        var DOMColl = createDOMCollection(
            /*header*/          "Top rated tv serie",
            /*data*/            data.results,
            /*mediaType*/       "tv",
            /*DOMTCollection*/  DOM.templateCollection,
            /*DOMTCollItem*/    DOM.templateCollItem,
            /*DOMTIcon*/        DOM.templateIcons
        );
        var DOMPos4 = DOM.view.children[4];
        DOMPos4.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos4.remove();
    });

    var movieGenreList = API.getGenres("movie");
    var tvGenreList = API.getGenres("tv");
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
        console.info(CollectionState)

        DOM.buttonMore?.setAttribute("data-display", "1");

        if (movieGenres.length > 1) {
            utils.randomPermutation(movieGenres);
        }
        if (tvGenres.length > 1) {
            utils.randomPermutation(tvGenres)
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
            discover(
                API.getDiscover(mediaType, genre, "1"),
                title,
                mediaType,
                i,
                5,
                DOM
            );
        }
    });

    DOM.buttonMore.addEventListener("click", function (e) {
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
            var DOMClone = DOM.templateCollSkeleton.content.cloneNode(true);
            DOM.view?.appendChild(DOMClone);
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
            discover(
                API.getDiscover(mediaType, genre, "1"),
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
    });
});
