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
    /**
    @type {"6"} */
    COLL_ITEM: "6",
    /**
    @type {"8"} */
    MODAL: "8",
    /**
    @type {"9"} */
    MODAL_CLOSE: "9",
    /**
    @type {"10"} */
    MODAL_GENRE: "10",
    /**
    @type {"11"} */
    MODAL_LANG: "11",
    /**
    @type {"12"} */
    MODAL_COMPANY: "12",
    /**
    @type {"13"} */
    MODAL_COUNTRY: "13",
    /**
    @type {"14"} */
    MODAL_CAST: "14",
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
    @type {(path: maybe<string>, DOMHero: HTMLDivElement) => undefined}*/
    initDOMImgLogo(path, DOMHero) {
        /**@type {HTMLElement}*/
        var DOMLogo = (
            DOMHero
            .lastElementChild
            .firstElementChild
        );
        if (path !== undefined) {
            DOMLogo.firstElementChild.setAttribute("data-opacity", "0");
            DOMLogo.lastElementChild.setAttribute("data-display", "1");
            DOMLogo.lastElementChild.setAttribute(
                "src",
                `https://image.tmdb.org/t/p/w300${path}`
            );
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
        var DOMDescription = DOMInfo.lastElementChild;

        DOMImgBg.setAttribute("data-display", "1");
        DOMImgBg.setAttribute(
            "src",
            `https://image.tmdb.org/t/p/w1280${hero.backdrop_path}`
        );

        if (hero.media_type === "tv") {
            DOMHLogo.insertAdjacentText("beforeend",hero.name);
        } else {
            DOMHLogo.insertAdjacentText("beforeend",hero.title);
        }

        DOMInfo.setAttribute("data-media", hero.media_type);
        DOMInfo.setAttribute("data-id", hero.id);

        DOMDescription.insertAdjacentText("beforeend",hero.overview);
    }
};


const View = {
    TYPE_SBUTTON: "data-sbuttont",
    topScroll: 0,
    DOMCollButtonOnclick(target) {
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
    },
    /**
    @type {(
        data: Promise<maybe<object>>,
        DOMItem: HTMLButtonElement,
        backdropAlt: null | string,
    ) => Promise<undefined>}*/
    async setItemImage(dataP, DOMItem, backdropAlt) {
        var data = await dataP;
        var DOMImg = DOMItem.firstElementChild;
        if (data === undefined
            || data.backdrops === undefined
            || data.backdrops.length === 0
        ) {
            if (backdropAlt !== null && backdropAlt.length > 0) {
                DOMImg.setAttribute(
                    "src",
                    `https://image.tmdb.org/t/p/w400${backdropAlt}`
                );
                DOMImg.setAttribute("data-display", "1");
                DOMItem.lastElementChild?.setAttribute("data-opacity", "0");
            }
        } else {
            var backdrop = data.backdrops[0];
            /** @type {HTMLImageElement}*/
            DOMImg.setAttribute(
                "src",
                `https://image.tmdb.org/t/p/w400${backdrop.file_path}`
            );
            DOMImg.setAttribute("data-display", "1");
            DOMItem.lastElementChild?.setAttribute("data-opacity", "0");
        }
    },
    /**
    @type {(
        header: string,
        data: object,
        mediaType: "movie" | "tv" | undefined,
        DFCollection: DocumentFragment,
    ) => HTMLElement}*/
    createDOMCollection(
        header,
        data,
        mediaType,
        DFCollection
    ) {
        /**@type {HTMLElement}*/
        var DOMCollection = DFCollection.children[1].cloneNode(true);
        //DOMCollection.children[0].insertAdjacentText("beforeend", header);
        var DOMTitle = DOMCollection.children[0]
        DOMTitle.insertAdjacentText("beforeend", header);

        for (var dataItem of data) {
            /**@type {HTMLButtonElement}*/
            const DOMItem = DFCollection.children[2].cloneNode(true)
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
            DOMItem.setAttribute("data-media", itemMediaType);
            DOMItem.lastElementChild.insertAdjacentText("beforeend", itemTitle);

            DOMItem.firstElementChild.setAttribute("alt", itemTitle);
            View.setItemImage(
                API.getImages(dataItem.id, itemMediaType),
                DOMItem,
                dataItem.backdrop_path
            );
            DOMCollection.lastElementChild.appendChild(DOMItem);
        }
        return DOMCollection;
    }
};

var ABORT = new AbortController();
var FETCH_OPT = {
    signal: ABORT.signal
};
/**
@type {(msg: string) => undefined} */
function abortFetch(msg) {
    ABORT.abort(msg);
    ABORT = new AbortController();
    FETCH_OPT.signal = ABORT.signal;
}

const Modal = {
    fragment: document.createDocumentFragment(),
    dataLoaded: false,
    creditsLoaded: false,
    /**
    @type {(arr: MDBCrew) => number}*/
    orderCredit(arr) {
        if (arr.length < 2) {
            return arr.length;
        }
        var fst = 0;
        var lst = 0;
        var mid = 0;
        var len = 1;
        for (var k = 1; k < arr.length; k += 1) {
            var target = arr[k];
            if (target.department !== "Crew") {
                while (fst <= lst) {
                    if (fst < lst) {
                        mid = Math.floor((fst + lst) / 2);
                    } else {
                        mid = fst;
                    }
                    if (target.department < arr[mid].department) {
                        lst = mid - 1;
                    } else if (target.department > arr[mid].department) {
                        fst = mid + 1;
                    } else {
                        if (target.job < arr[mid].job) {
                            lst = mid - 1;
                        } else {
                            fst = mid + 1;
                        }
                    }
                }
                if (fst !== len) {
                    arr.copyWithin(fst + 1, fst, len);
                }
                arr[fst] = target;
                fst = 0;
                lst = len;
                len += 1;
            }
        }
        return len;
    },
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOMModalItem: HTMLElement,
        DFModal: DocumentFragment,
    ) => Promise<undefined>} */
    async getCredit(mediaType, id, DOMModalItem, DFModal) {
        var data = await API.getCredits(mediaType, id, FETCH_OPT);
        if (data === undefined) {
            return;
        }
        var DOMCredits = DOMModalItem.children[3].lastElementChild;

        var DOMTItem = DFModal.children[0];
        var DOMTCDep = DFModal.children[1];
        var DOMTCJob = DFModal.children[2];
        var DOMTSpan = DFModal.children[3];

        var DOMDepart;
        var DOMItem;
        var DOMJob;
        if (data.cast.length > 0) {
            DOMJob = DOMTCJob.cloneNode(true);
            DOMJob.firstElementChild.textContent = "Cast:"

            for (var i = 0; i < data.cast.length; i += 1) {
                var cast = data.cast[i];
                DOMItem = DOMTItem.cloneNode(false);
                DOMItem.setAttribute("data-id", cast.id);
                DOMItem.setAttribute("data-type", TYPE.MODAL_CAST);
                DOMItem.textContent = cast.name;
                DOMJob.appendChild(DOMItem);
            }
            DOMCredits.appendChild(DOMJob);

            DOMJob = undefined;
        }
        if (data.crew.length > 0) {
            var crews = data.crew;
            var data_len = Modal.orderCredit(crews);
            console.info(crews)
            var department = "";
            var job = "";
            for (var j = 0; j < data_len; j += 1) {
                var crew = crews[j];
                if (crew.department !== department) {
                    if (DOMDepart !== undefined) {
                        if (DOMJob !== undefined) {
                            DOMDepart?.appendChild(DOMJob);
                            DOMJob = undefined;
                        }
                        Modal.fragment.appendChild(DOMDepart);
                    }
                    department = crew.department;
                    DOMDepart = DOMTCDep.cloneNode(true);
                    DOMDepart.firstElementChild.textContent = department;
                }
                if (crew.job !== job) {
                    if (DOMJob !== undefined) {
                        DOMDepart?.appendChild(DOMJob);
                    }
                    job = crew.job;
                    DOMJob = DOMTCJob.cloneNode(true);
                    DOMJob.firstElementChild.textContent = `${job}:`;
                }
                if (
                    department === "Directing"
                    && (
                        job === "Director"
                        || job === "Series Director"
                    )
                ) {
                    DOMItem = DOMTItem.cloneNode(true);
                    DOMItem.setAttribute("data-id", crew.id);
                    DOMItem.setAttribute("data-type", TYPE.MODAL_CAST);
                } else {
                    DOMItem = DOMTSpan.cloneNode(false);
                }
                DOMItem.textContent = crew.name;
                DOMJob.appendChild(DOMItem)
            }
            if (DOMDepart !== undefined) {
                if (DOMJob !== undefined) {
                    DOMDepart?.appendChild(DOMJob);
                }
                Modal.fragment.appendChild(DOMDepart);
            }
            DOMCredits?.appendChild(Modal.fragment);
        }
        Modal.creditsLoaded = true;
    },
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOM: DOM_T,
    ) => Promise<undefined>}*/
    async getData(mediaType, id, DOM) {
        var data = await API.get(mediaType, id, FETCH_OPT);
        if (data === undefined) {
            return;
        }
        var DOMModalItem;
        var DOMModal = DOM.modal;
        var DOMTSec =  DOM.templateModal.content.children[2];
        var DOMTItem = DOM.templateModal.content.children[0];
        if (mediaType === "tv") {
            DOMModalItem = DOMModal.children[0];
            var DOMImg = DOMModalItem.children[1].firstElementChild.firstElementChild;
            var DOMTitle = DOMModalItem.children[3].children[0];
            var DOMGenres = DOMModalItem.children[3].children[1];
            var DOMDescription = DOMModalItem.children[3].children[2];
            var DOMCredits = DOMModalItem.children[3].lastElementChild;

            var DOMTItem = DOM.templateModal.content.children[0]
            var DOMTSpan = DOM.templateModal.content.children[3]
            var DOMItem;

            DOMTitle.textContent = data.name;
            DOMDescription.textContent = data?.overview;

            if (data?.backdrop_path != null) {
                DOMImg.setAttribute(
                    "src",
                    `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
                );
                DOMImg.setAttribute("alt", data.name);
                DOMImg.setAttribute("data-display", "1");
            }

            if (data.genres.length > 0) {
                for (var genre of data.genres) {
                    DOMItem = DOMTItem.cloneNode(true);
                    DOMItem.textContent = genre.name;
                    DOMItem.setAttribute("data-id", genre.id);
                    DOMItem.setAttribute("data-type", TYPE.MODAL_GENRE);
                    Modal.fragment.appendChild(DOMItem);
                }
                DOMGenres.appendChild(Modal.fragment);
            }

            var DOMPopularity = DOMTSec.cloneNode(true);
            DOMPopularity.firstElementChild.textContent = "Popularity:";
            DOMItem = DOMTSpan.cloneNode(true);
            DOMItem.textContent = String(data.popularity);
            DOMPopularity.appendChild(DOMItem);
            DOMCredits?.appendChild(DOMPopularity);

            var DOMDate = DOMTSec.cloneNode(true);
            DOMDate.firstElementChild.textContent = "First Air Date:";
            DOMItem = DOMTSpan.cloneNode(true);
            DOMItem.textContent = data.first_air_date;
            DOMDate.appendChild(DOMItem);
            DOMCredits.appendChild(DOMDate);

            if (data.spoken_languages.length > 0) {
                var DOMLang = DOMTSec.cloneNode(true);
                DOMLang.firstElementChild.textContent = "Languages:";
                for (var lang of data.spoken_languages) {
                    DOMItem = DOMTSpan.cloneNode(true);
                    if (lang.name.length > 0) {
                        DOMItem.textContent = lang.name;
                    } else {
                        DOMItem.textContent = lang.english_name;
                    }
                    DOMLang.appendChild(DOMItem);
                }
                DOMCredits?.appendChild(DOMLang);
            }

            if (data.production_companies.length > 0) {
                var DOMPC = DOMTSec.cloneNode(true);
                DOMPC.firstElementChild.textContent = "Companies:";
                for (var companies of data.production_companies) {
                    DOMItem = DOMTItem.cloneNode(true);
                    DOMTItem.setAttribute("data-type", TYPE.MODAL_COMPANY);
                    DOMTItem.setAttribute("data-id", companies.id);
                    DOMItem.textContent = companies.name;
                    DOMPC.appendChild(DOMItem);
                }
                DOMCredits?.appendChild(DOMPC);
            }

            if (data.production_countries.length > 0) {
                var DOMPC = DOMTSec.cloneNode(true);
                DOMPC.firstElementChild.textContent = "Countries:";
                for (var countries of data.production_countries) {
                    DOMItem = DOMTSpan.cloneNode(true);
                    DOMItem.textContent = countries.name;
                    DOMPC.appendChild(DOMItem);
                }
                DOMCredits?.appendChild(DOMPC);
            }
        } else {
            DOMModalItem = DOMModal.children[1];
            var DOMImg = DOMModalItem.children[1].firstElementChild.firstElementChild;
            var DOMTitle = DOMModalItem.children[3].children[0];
            var DOMGenres = DOMModalItem.children[3].children[1];
            var DOMDescription = DOMModalItem.children[3].children[2];
            var DOMCredits = DOMModalItem.children[3].lastElementChild;

            var DOMTItem = DOM.templateModal.content.children[0]
            var DOMTSpan = DOM.templateModal.content.children[3]
            var DOMItem;

            DOMTitle.textContent = data.title;
            DOMDescription.textContent = data?.overview;

            if (data?.backdrop_path != null) {
                DOMImg.setAttribute(
                    "src",
                    `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
                );
                DOMImg.setAttribute("alt", data.title);
                DOMImg.setAttribute("data-display", "1");
            }

            if (data.genres.length > 0) {
                for (var genre of data.genres) {
                    DOMItem = DOMTItem.cloneNode(true);
                    DOMItem.textContent = genre.name;
                    DOMItem.setAttribute("data-id", genre.id);
                    DOMItem.setAttribute("data-type", TYPE.MODAL_GENRE);
                    Modal.fragment.appendChild(DOMItem);
                }
                DOMGenres.appendChild(Modal.fragment);
            }

            var DOMPopularity = DOMTSec.cloneNode(true);
            DOMPopularity.firstElementChild.textContent = "Popularity:";
            DOMItem = DOMTSpan.cloneNode(true);
            DOMItem.textContent = String(data.popularity);
            DOMPopularity.appendChild(DOMItem);
            DOMCredits?.appendChild(DOMPopularity);

            var DOMDate = DOMTSec.cloneNode(true);
            DOMDate.firstElementChild.textContent = "Release Date:";
            DOMItem = DOMTSpan.cloneNode(true);
            DOMItem.textContent = data.release_date;
            DOMDate.appendChild(DOMItem);
            DOMCredits?.appendChild(DOMDate);

            if (data.spoken_languages.length > 0) {
                var DOMLang = DOMTSec.cloneNode(true);
                DOMLang.firstElementChild.textContent = "Languages:";
                for (var lang of data.spoken_languages) {
                    DOMItem = DOMTSpan.cloneNode(true);
                    if (lang.name.length > 0) {
                        DOMItem.textContent = lang.name;
                    } else {
                        DOMItem.textContent = lang.english_name;
                    }
                    DOMLang.appendChild(DOMItem);
                }
                DOMCredits?.appendChild(DOMLang);
            }

            if (data.production_companies.length > 0) {
                var DOMPC = DOMTSec.cloneNode(true);
                DOMPC.firstElementChild.textContent = "Companies:";
                for (var companies of data.production_companies) {
                    DOMItem = DOMTItem.cloneNode(true);
                    DOMTItem.setAttribute("data-type", TYPE.MODAL_COMPANY);
                    DOMTItem.setAttribute("data-id", companies.id);
                    DOMItem.textContent = companies.name;
                    DOMPC.appendChild(DOMItem);
                }
                DOMCredits?.appendChild(DOMPC);
            }

            if (data.production_countries.length > 0) {
                var DOMPC = DOMTSec.cloneNode(true);
                DOMPC.firstElementChild.textContent = "Countries:";
                for (var countries of data.production_countries) {
                    DOMItem = DOMTSpan.cloneNode(true);
                    DOMItem.textContent = countries.name;
                    DOMPC.appendChild(DOMItem);
                }
                DOMCredits?.appendChild(DOMPC);
            }

        }
        Modal.getCredit(
            mediaType,
            id,
            DOMModalItem,
            DOM.templateModal.content
        );
        Modal.dataLoaded = true;
        console.info(data);
    },
    /**
    @type {(DOM: DOM_T) => undefined} */
    close(DOM) {
        if (!Modal.dataLoaded || !Modal.creditsLoaded) {
            abortFetch("Close Modal");
        }
        Modal.dataLoaded = false;
        Modal.creditsLoaded = false;
        var type = DOM.modal.getAttribute("data-select");
        var DOMModalItem;
        if (type === "tv") {
            DOMModalItem = DOM.modal.children[0];
        } else {
            DOMModalItem = DOM.modal.children[1];
        }
        var DOMImg = DOMModalItem.children[1].firstElementChild?.firstElementChild;
        var DOMTitle = DOMModalItem.children[3].children[0];
        var DOMGenres = DOMModalItem.children[3].children[1];
        var DOMDescription = DOMModalItem.children[3].children[2];

        DOMModalItem.children[3].lastElementChild.replaceChildren();

        DOMImg.setAttribute("data-display", "0");
        DOMTitle.textContent = "";
        DOMDescription.textContent = "";

        DOMGenres.replaceChildren();
        DOM.main.style.removeProperty("transform");
        DOM.main.style.setProperty("position", "relative");

        document.firstElementChild.scrollTop = View.topScroll;
        DOM.modal.setAttribute("data-display", "0");
    },
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOM: DOM_T,
    ) => undefined}*/
    open (mediaType, id, DOM) {
        View.topScroll = document.firstElementChild.scrollTop;
        document.firstElementChild.scrollTop = 0;

        DOM.modal.setAttribute("data-display", "1");
        DOM.modal.setAttribute("data-select", mediaType);

        DOM.main.style.setProperty(
            "transform",
            `translateY(-${View.topScroll}px)`
        );
        DOM.main.style.setProperty("position", "fixed");
        Modal.getData(mediaType, id, DOM);
    },
};


async function discover(DataPromise, title, mediaType, i, base, DOM) {
    var data = await DataPromise;
    console.info(title, data);
    if (data?.results === undefined || data.results.length === 0) {
        throw Error("API.getTopRated does not have data");
    }
    var DOMColl = View.createDOMCollection(
        /*header*/          title,
        /*data*/            data.results,
        /*mediaType*/       mediaType,
        /*DFCollection*/    DOM.templateCollection.content,
    );
    var DOMPos = DOM.view.children[base + i];
    DOMPos.insertAdjacentElement("beforebegin", DOMColl);
    DOMPos.remove();
}

window.addEventListener("DOMContentLoaded", function () {
    var DOM = {
        //template
        templateCollection: document.getElementById("template_collection"),
        templateIcons: document.getElementById("template_icons"),
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
    if (DOM.templateIcons === null) {
        throw Error("DOM.templateIcons is null");
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

    Theme.init();

    DOM.headerButtonTheme.setAttribute("data-type", Theme.current);
    DOM.headerButtonTheme.addEventListener("click", Theme.onclick);

    DOM.headerButtonNav.addEventListener("click", NavMethods.buttonNavOnclick);
    DOM.headerNav.addEventListener("focusout", NavMethods.navOnfocusout);
    DOM.headerNav.addEventListener("click", NavMethods.navOnclick);

    DOM.view.addEventListener("click", function (e) {
        /**
        @type {HTMLElement | null}*/
        var target = e.target;
        var type = target.getAttribute("data-type");
        if (type === TYPE.COLL_BUTTON) {
            View.DOMCollButtonOnclick(target);
        } else if (type === TYPE.COLL_ITEM) {
            var mediaType = target?.getAttribute("data-media");
            var id = target?.getAttribute("data-id");
            Modal.open(mediaType, id, DOM);
        }
    });

    DOM.hero.lastElementChild.addEventListener("click", function (e) {
        var target = e.target;
        var id = target?.getAttribute("data-id");
        if (id !== undefined)  {
            var mediaType = target?.getAttribute("data-media");
            Modal.open(mediaType, id, DOM);
        }
    });

    DOM.modal.addEventListener("click", function (e) {
        var target = e.target;
        var type = target.getAttribute("data-type");
        if (type === TYPE.MODAL || type === TYPE.MODAL_CLOSE) {
            Modal.close(DOM);
        }
    });

    var trendingPromise = API.getTrending("1");
    trendingPromise.then(function (data) {
        console.info("trending: ", data);
    });

    var heroPromise = trendingPromise.then(HeroMethods.selectHero);
    heroPromise.then(function (data) {
        console.info("hero: ", data);
    });

    heroPromise.then(HeroMethods.getHeroLogo).then(function (data) {
        HeroMethods.initDOMImgLogo(data, DOM.hero);
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
        var DOMColl = View.createDOMCollection(
            /*header*/          "Week Trendings",
            /*data*/            data.results,
            /*mediaType*/       undefined,
            /*DFCollection*/  DOM.templateCollection.content,
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
        var DOMColl = View.createDOMCollection(
            /*header*/          "Popular Movies",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*DFCollection*/  DOM.templateCollection.content,
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
        var DOMColl = View.createDOMCollection(
            /*header*/          "Popular Tv series",
            /*data*/            data.results,
            /*mediaType*/       "tv",
            /*DFCollection*/  DOM.templateCollection.content,
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
        var DOMColl = View.createDOMCollection(
            /*header*/          "Top rated movie",
            /*data*/            data.results,
            /*mediaType*/       "movie",
            /*DFCollection*/  DOM.templateCollection.content,
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
        var DOMColl = View.createDOMCollection(
            /*header*/          "Top rated tv serie",
            /*data*/            data.results,
            /*mediaType*/       "tv",
            /*DFCollection*/  DOM.templateCollection.content,
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
