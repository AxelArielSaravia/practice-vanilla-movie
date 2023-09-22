import API from "./api.js";
import {random} from "./utils.js";

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
    MAX: 20,
    genresMax: 0,
    count: 7,
};

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
        const t = localStorage.getItem("theme");
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
        const DOMThemeButton = e.currentTarget;
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
        const DOMButtonNav = e.currentTarget;
        /**@type {HTMLUListElement}*///This will crash if is null
        const DOMNav = DOMButtonNav.nextElementSibling;
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
        const relatedTarget = e.relatedTarget;
        if (
            relatedTarget === null
            || relatedTarget.getAttribute("data-type") !== TYPE.NAV_LINK
        ) {
            /**@type {HTMLUListElement}*///This will crash if is null
            const DOMNav = e.currentTarget;
            DOMNav.setAttribute(
                NavMethods.ATTR_SHOW,
                NavMethods.HIDDEN
            );
        }
    },
    navOnclick(e) {
        const target = e.target;
        if (target.getAttribute("data-type") === TYPE.NAV_LINK) {
            const type = target.getAttribute(NavMethods.ATTR_LINK_TYPE);
            /**@type {HTMLUListElement}*///This will crash if is null
            const DOMNav = e.currentTarget;
            /**@type {HTMLButtonElement}*///This will crash if is null
            const DOMButtonNav = DOMNav.previousElementSibling;
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
        const n = random(trendings.length);
        return trendings[n];
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
        const id = hero.id;
        const mediaType = hero.media_type;
        let images = await API.getImages(id, mediaType);
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
        const DOMLogo = (
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
        const DOMImgBg = DOMHero.firstElementChild.firstElementChild;
        /**@type {HTMLElement}*/
        const DOMInfo = DOMHero.lastElementChild;
        /**@type {HTMLElement}*/
        const DOMHLogo = DOMInfo.firstElementChild.firstElementChild;
        /**@type {HTMLParamElement}*/
        const DOMDescription = DOMInfo.children[2];

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
    DOMTIcon: HTMLTemplateElement
) => Promise<undefined>}*/
async function setItemImage(dataP, DOMItem, DOMTIcon) {
    const data = await dataP;
    if (data === undefined
        || data.backdrops === undefined
        || data.backdrops.length === 0
    ) {
        DOMItem.firstElementChild.setAttribute("data-display", "1");
        var DOMIVideo = DOMTIcon.content.firstElementChild?.cloneNode(true);
        DOMItem.appendChild(DOMIVideo);
    } else {
        const backdrop = data.backdrops[0];
        /** @type {HTMLImageElement}*/
        const DOMImg = DOMItem.lastElementChild;
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
    const DOMClone = DOMTCollection.content.cloneNode(true);
    /**@type {HTMLElement}*/
    const DOMCollection = DOMClone.firstElementChild;
//    DOMCollection.children[0].insertAdjacentText("beforeend", header);
    const DOMTitle = DOMCollection.children[0]
    DOMTitle.insertAdjacentText("beforeend", header);

    for (let dataItem of data) {
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
            DOMTIcon
        );
        DOMCollection.lastElementChild.appendChild(DOMItem);
    }
    return DOMCollection;
}

const MEDIA = {
    pointerFine: window.matchMedia("(pointer: fine)"),
}

window.addEventListener("DOMContentLoaded", function () {
    const DOM = {
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

    const trendingPromise = API.getTrending("1");
    trendingPromise.then(console.info);

    const heroPromise = trendingPromise.then(HeroMethods.selectHero);
    heroPromise.then(console.info);

    heroPromise
    .then(HeroMethods.getHeroLogo)
    .then(function (data) {
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
        let DOMColl = createDOMCollection(
            "Week Trendings",
            data.results,
            undefined,
            DOM.templateCollection,
            DOM.templateCollItem,
            DOM.templateIcons
        );
        const DOMPos0 = DOM.view.children[0];
        DOMPos0.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos0.remove();
    });

    API.getPopular("movie", "1").then(function (data) {
        console.info("getPopular movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getDiscover does not have data");
        }
        let DOMColl = createDOMCollection(
            "Popular Movies",
            data.results,
            "movie",
            DOM.templateCollection,
            DOM.templateCollItem,
            DOM.templateIcons
        );
        const DOMPos1 = DOM.view.children[1];
        DOMPos1.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos1.remove();
    });

    API.getPopular("tv", "1").then(function (data) {
        console.info("getPopular tv", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getDiscover does not have data");
        }
        let DOMColl = createDOMCollection(
            "Popular Tv series",
            data.results,
            "tv",
            DOM.templateCollection,
            DOM.templateCollItem,
            DOM.templateIcons
        );
        const DOMPos2 = DOM.view.children[2];
        DOMPos2.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos2.remove();
    });

    API.getTopRated("movie", "1").then(function (data) {
        console.info("getTopRate movie", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        let DOMColl = createDOMCollection(
            "Top rated movie",
            data.results,
            "movie",
            DOM.templateCollection,
            DOM.templateCollItem,
            DOM.templateIcons
        );
        const DOMPos3 = DOM.view.children[3];
        DOMPos3.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos3.remove();
    });

    API.getTopRated("tv", "1").then(function (data) {
        console.info("getTopRate tv", data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        let DOMColl = createDOMCollection(
            "Top rated tv serie",
            data.results,
            "tv",
            DOM.templateCollection,
            DOM.templateCollItem,
            DOM.templateIcons
        );
        const DOMPos4 = DOM.view.children[4];
        DOMPos4.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos4.remove();
    });

    const movieGenreList = API.getGenres("movie");
    const tvGenreList = API.getGenres("tv");
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

        CollectionState.genresMax = data[0].genres.length + data[1].genres.length;

        for (let i = 0; i < 2; i += 1) {
            /** @type {"movie" | "tv"}*/
            let mediaType;
            /** @type {number}*/
            let genre;
            /** @type {string}*/
            let genreName;
            /** @type {string}*/
            let title;
            if (Math.random() < 0.5) {
                let movieGenres = data[0].genres;
                const rv = Math.floor(Math.random() * movieGenres.length);
                genre = movieGenres[rv].id;
                genreName = movieGenres[rv].name;
                mediaType = "movie";
                title = `${genreName} Tv series`;
            } else {
                let tvGenres = data[1].genres;
                const rv = Math.floor(Math.random() * tvGenres.length); 
                genre = tvGenres[rv].id;
                genreName = tvGenres[rv].name;
                mediaType = "tv";
                title = `${genreName} Movies`;
            }
            API.getDiscover(mediaType, genre).then(function (data) {
                console.info(genre, data);
                if (data?.results === undefined || data.results.length === 0) {
                    throw Error("API.getTopRated does not have data");
                }
                let DOMColl = createDOMCollection(
                    title,
                    data.results,
                    mediaType,
                    DOM.templateCollection,
                    DOM.templateCollItem,
                    DOM.templateIcons
                );
                const DOMPos = DOM.view.children[5 + i];
                DOMPos.insertAdjacentElement("beforebegin", DOMColl);
                DOMPos.remove();
            });
        }
    });
});
