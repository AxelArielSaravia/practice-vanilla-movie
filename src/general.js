const TYPE = {
    /**
    @type {"0"}*/
    NAV_LINK: "0",
    /**
    @type {"6"} */
    ITEM: "6",
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
    MODAL_COMPANY: "11",
    /**
    @type {"12"} */
    MODAL_CAST: "12",
    /**
    @type {"13"} */
    MODAL_C_MORE: "13",
    /**
    @type {"14"} */
    MODAL_SEASON_N: "14",
};

const Utils = {
    /**
    @type {(max: number) => number}*/
    random(max) {
        return Math.floor(Math.random() * max);
    },
    /**
    @type {(arr: Array<any>) => undefined} */
    randomPermutation(arr) {
        var n = arr.length;
        for (var i = 0; i < n - 1; i += 1) {
            var j = i + Math.floor(Math.random() * (n - i))
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
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

/**
@type {(res: Response) => Promise<object> | undefined}*/
function fetchResolve(res) {
    if (res.ok) {
        return res.json();
    }
}

const API = {
    /**
    @type {(type: "movie" | "tv") => Promise<maybe<MDBGenres>>} */
    getGenres(type) {
        return (
            fetch(`${window.location.origin}/api/genres?t=${type}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(
        id: string,
        type: "movie" | "tv",
    ) => Promise<maybe<MDBImages>>} */
    getImages(id, type) {
        return (
            fetch(`${window.location.origin}/api/images?t=${type}&i=${id}`)
            .then(fetchResolve)
       );
    },
    //Get trending movies and tv series
    /**
    @type {(
        type: "all" | "tv" | "movie"
        page: string
    ) => Promise<maybe<MDBResponse<MDBTrending>>>} */
    getTrending(type, page = "1") {
        return (
            fetch(`${window.location.origin}/api/trending?t=${type}&p=${page}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(
        type: "movie" | "tv",
        page: string
    ) => Promise<maybe<MDBResponse<MDBPopular>>>}*/
    getPopular(type, page = "1") {
        return (
            fetch(`${window.location.origin}/api/popular?t=${type}&p=${page}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(
        type: "movie" | "tv",
        page: string,
        genre: undefined | number,
        cast: undefined | string,
        crew: undefined | string,
        company: undefined | string,
    ) => Promise<maybe<MDBResponse<MDBDiscover>>>}*/
    getDiscover(type, page = "1", genre, cast, crew, company) {
        var p = `${window.location.origin}/api/discover?t=${type}&p=${page}`;
        if (genre !== undefined) {
            p = `${p}&g=${genre}`;
        } else if (cast !== undefined) {
            p = `${p}&ca=${cast}`;
        } else if (crew !== undefined) {
            p = `${p}&cr=${crew}`;
        } else if (company !== undefined) {
            p = `${p}&co=${company}`;
        }
        return fetch(p).then(fetchResolve);
    },
    /**
    @type {(
        type: "movie" | "tv",
        page: string
    ) => Promise<maybe<MDBResponse<MDBDiscover>>>} */
    getTopRated(type, page = "1") {
        return (
            fetch(`${window.location.origin}/api/toprated?t=${type}&p=${page}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(
        type: "movie" | "tv",
        id: string,
        similar: boolean,
        option: undefined | {signal: AbortSignal}
    ) => Promise<maybe<MDBIMovie | MDBITv>>} */
    get(type, id, similar, option) {
        var url = `${window.location.origin}/api/${type}?i=${id}`;
        if (similar) {
            url += "&s"
        }
        return fetch(url, option).then(fetchResolve);
    },
    /**
    @type {(
        type: "movie" | "tv",
        id: string,
        option: undefined | {signal: AbortSignal}
    ) => Promise<maybe<MDBCredits>>} */
    getCredits(type, id, option) {
        return fetch(
            `${window.location.origin}/api/credits?t=${type}&i=${id}`,
            option
        ).then(fetchResolve);
    },
    /**
    @type {(
        id: string,
        n: number,
        option: undefined | {signal: AbortSignal}
    ) => Promise<object>} */
    getSeason(id, n, option) {
        return fetch(
            `${window.location.origin}/api/season?i=${id}&n=${n}`,
            option
        ).then(fetchResolve);
    },
    /**
    @type {(
        query: string,
        page: string
    ) => Promise<object>} */
    getSearch(query, page = "1") {
        return fetch(
            `${window.location.origin}/api/search?q=${query}&p=${page}`
        ).then(fetchResolve);
    }
};

const Nav = {
    ATTR_SHOW: "data-mbshow",
    HIDDEN: "0",
    SHOW: "1",
    //Toggle nav menu on header_button-nav onclick
    buttonNavOnclick(e) {
        /**@type {HTMLButtonElement}*///This will crash if is null
        var DOMButtonNav = e.currentTarget;
        /**@type {HTMLUListElement}*///This will crash if is null
        var DOMNav = DOMButtonNav.nextElementSibling;
        if (DOMNav.getAttribute(Nav.ATTR_SHOW) === Nav.HIDDEN) {
            DOMNav.setAttribute(Nav.ATTR_SHOW, Nav.SHOW);
            //First nav-link element
            DOMNav.firstElementChild.firstElementChild.focus();
        }
    },
    //hidde nav menu if the focus is out of the nav menu of the 
    navOnfocusout(e) {
        var relatedTarget = e.relatedTarget;
        var type = relatedTarget?.getAttribute("data-type");
        if (relatedTarget === null || type !== TYPE.NAV_LINK) {
            /**@type {HTMLUListElement}*///This will crash if is null
            var DOMNav = e.currentTarget;
            DOMNav.setAttribute(
                Nav.ATTR_SHOW,
                Nav.HIDDEN
            );
        }
    }
};

const Hero = {
    /**
    @type {(trendings: Array<MDBTrending>) => MDBTrending}*/
    select(trendings) {
        return trendings[Utils.random(trendings.length)];
    },
    //Select a random trending movie or tv serie
    /**
    @type {(trending: maybe<MDBResponse<MDBTrending>>) => never | maybe<HeroItem>}*/
    selectHero(trending) {
        if (trending) {
            if (!trending.results || trending.results.length === 0) {
                throw Error("trending.results does not have data");
            }
            return Hero.select(trending.results);
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
        var DOMTitle = DOMInfo.firstElementChild;
        /**@type {HTMLElement}*/
        var DOMHLogo = DOMTitle.firstElementChild;
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
        DOMTitle.setAttribute("href", Route.getHref(hero.media_type, hero.id));
        DOMTitle.setAttribute("data-media", hero.media_type);
        DOMTitle.setAttribute("data-id", hero.id);

        if (hero.overview !== undefined) {
            if (hero.overview.length > 300) {
                var spaceIndex = hero.overview.lastIndexOf(" ", 300);
                var heroOverview = `${hero.overview.substring(0, spaceIndex)}...`;
                DOMDescription.insertAdjacentText("beforeend",heroOverview);
            } else {
                DOMDescription.insertAdjacentText("beforeend",hero.overview);
            }
        }
    },
    /**
    @type {(target: HTMLElement, DOM: DOM_T, e: Event) => undefined} */
    DOMTitleOnclick(target, DOM, e) {
        e.preventDefault();
        var id = target.getAttribute("data-id");
        var mediaType = target.getAttribute("data-media");
        if (id !== null && mediaType !== null)  {
            Modal.open(mediaType, id, DOM, true);
        }
    }
};

const Route = {
    Q_TITLE: "tl",
    Q_MEDIA_TYPE: "t",
    Q_GENRE: "g",
    Q_CREW: "cr",
    Q_CAST: "ca",
    Q_COMPANY: "co",
    Q_ID: "i",
    Q_SEARCH: "q",

    url: new URL(window.location.href),
    origin: `${window.location.origin}${window.location.pathname}`,
    href: `${window.location.origin}${window.location.pathname}`,
    hrefq: `${window.location.origin}${window.location.pathname}?`,

    /**
    @type {(type: "movie" | "tv", id: string) => string} */
    getHref(type, id) {
        return `${Route.hrefq}${Route.Q_MEDIA_TYPE}=${type}&${Route.Q_ID}=${id}`;
    },
    /**
    @type {(route: string) => undefined} */
    pushstate(route) {
        history.pushState(undefined, "", route)
    },
    /**
    @type {(DOM: DOM_T) => undefined} */
    init(DOM) {
        var qtype = Route.url.searchParams.get(Route.Q_MEDIA_TYPE);
        var qid = Route.url.searchParams.get(Route.Q_ID);
        if (qtype !== null && qid !== null) {
            if (qtype == "tv" || qtype == "movie") {
                Modal.open(qtype, qid, DOM, false);
            } else {
                console.error(`Bad query: 'type=${qtype}'`);
            }
        }
    },
    /**
    @type {(DOM: DOM_T) => undefined} */
    onpopstate(DOM) {
        Route.url.href = window.location.href;
        var qtype = Route.url.searchParams.get(Route.Q_MEDIA_TYPE);
        var qid = Route.url.searchParams.get(Route.Q_ID);
        if (Modal.isOpen) {
            Modal.close(DOM);
        }
        if (
            qid !== null
            && (qtype === "tv" || qtype === "movie")
        ) {
            Modal.open(qtype, qid, DOM, false);
        }
    }
};

const Item = {
    /**
    @type {(
        dataItem: object,
        mediaType: "movie" | "tv" | "all",
        DOMTItem: HTMLElement,
    ) => HTMLElement}*/
    createDOMItem(dataItem, mediaType, DOMTItem) {
        if (mediaType === "all") {
            mediaType = dataItem.media_type;
        }
        /**
        @type {HTMLButtonElement}*/
        var DOMItem = DOMTItem.cloneNode(true)
        var title;
        if (mediaType === "movie") {
            title = dataItem.title;
        } else {
            title = dataItem.name;
        }
        DOMItem.setAttribute("data-id", dataItem.id);
        DOMItem.setAttribute("title", title);
        DOMItem.setAttribute(
            "href",
            Route.getHref(mediaType, dataItem.id)
        );
        DOMItem.setAttribute("data-media", mediaType);
        DOMItem.children["title"].insertAdjacentText("beforeend", title);

        Item.setImage(
            API.getImages(dataItem.id, mediaType),
            DOMItem,
            dataItem.backdrop_path
        );
        return DOMItem;
    },
    /**
    @type {(
        data: Promise<maybe<object>>,
        DOMItem: HTMLButtonElement,
        backdropAlt: null | string,
    ) => Promise<undefined>}*/
    async setImage(dataP, DOMItem, backdropAlt) {
        var data = await dataP;
        var DOMImg = DOMItem.lastElementChild;
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
            }
        } else {
            var backdrop = data.backdrops[0];
            /** @type {HTMLImageElement}*/
            DOMImg.setAttribute(
                "src",
                `https://image.tmdb.org/t/p/w400${backdrop.file_path}`
            );
            DOMImg.setAttribute("data-display", "1");
        }
    },
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
    topScroll: 0,
    id: "",
    isOpen: false,
    /**
    @type {"tv" | "movie"} */
    mediaType: "tv",
    creditsLoaded: false,
    dataLoaded: false,
    similarLoaded: false,
    seasonLoaded: false,
    seasonNumber: -1,
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOMModalData: HTMLElement,
        DFModal: DocumentFragment,
    ) => Promise<undefined>} */
    async getCredit(mediaType, id, DOMModalData, DFModal) {
        var data = await API.getCredits(mediaType, id, FETCH_OPT);
        if (data === undefined) {
            return;
        }
        Modal.DOMMCreditsFill(data, mediaType, DOMModalData, DFModal);
        Modal.creditsLoaded = true;
    },
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOM: DOM_T,
        changeRoute: boolean
    ) => Promise<undefined>}*/
    async getData(mediaType, id, DOM, changeRoute) {
        var data
        try {
            data = await API.get(mediaType, id, false, FETCH_OPT);
        } catch {
            Modal.close(DOM);
            return;
        }
        if (data === undefined) {
            Modal.close(DOM);
            return;
        }
        if (changeRoute) {
            Route.pushstate(Route.getHref(mediaType, id));
        }
        if (mediaType === "tv") {
            var DOMModalTv = DOM.modal.children[0];
            Modal.getCredit(
                mediaType,
                id,
                DOMModalTv,
                DOM.templateModal.content
            );
            Modal.getSimilar(
                mediaType,
                id,
                DOMModalTv,
                DOM.templateModal.content
            );
            var seasons = data.seasons;
            if (seasons.length > 0) {
                var isSeason1 = false;
                for (var season of seasons) {
                    if (season.season_number === 1) {
                        isSeason1 = true;
                        break;
                    }
                }
                if (isSeason1) {
                    Modal.seasonNumber = 1;
                } else {
                    Modal.seasonNumber = seasons[0].season_number;
                }
                Modal.getSeason(
                    id,
                    Modal.seasonNumber,
                    DOMModalTv,
                    DOM.templateModal.content
                );
            } else {
                Modal.seasonNumber = -1;
            }
            Modal.DOMMTvFill(data, DOM);
        } else {
            var DOMModalMovie = DOM.modal.children[1];
            Modal.getCredit(
                mediaType,
                id,
                DOMModalMovie,
                DOM.templateModal.content
            );
            Modal.getSimilar(
                mediaType,
                id,
                DOMModalMovie,
                DOM.templateModal.content
            );
            Modal.DOMMMovieFill(data, DOM)
        }
        Modal.dataLoaded = true;
    },
    /**
    @type {(
        id: string,
        n: number,
        DOMModalData: HTMLElement,
        DFModal: DocumentFragment,
    ) => Promise<undefined>}*/
    async getSeason(id, n, DOMModalData, DFModal) {
        var data = await API.getSeason(id, n, FETCH_OPT);
        if (data === undefined) {
            return;
        }
        Modal.DOMSeasonFill(data, DOMModalData, DFModal);
        Modal.seasonLoaded = true;
    },
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOMModalData: HTMLElement,
        DFModal: DocumentFragment,
    ) => Promise<undefined>}*/
    async getSimilar(mediaType, id, DOMModalData, DFModal) {
        var data = await API.get(mediaType, id, true, FETCH_OPT);
        if (data === undefined) {
            return;
        }
        Modal.DOMMSimilarFill(data, mediaType, DOMModalData, DFModal)
        Modal.similarLoaded = true;
    },
    /**
    @type {(arr: MDBCrew) => number}*/
    orderCredits(arr) {
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
        data: MDBSeason,
        DOMModalData: HTMLElement,
        DFModal: DocumentFragment,
    ) => undefined} */
    DOMSeasonFill(data, DOMModalData, DFModal) {
        var DOMSeason = DOMModalData.children[3].children[6];
        var DOMTEpisode = DFModal.children[8];
        var DOMTButton = DFModal.children[4];

        var DOMSEpisodeCount = DOMSeason.firstElementChild.firstElementChild;
        var DOMSTitle = DOMSeason.children[1];
        var DOMSDescription = DOMSeason.children[2];
        var DOMEpisodes = DOMSeason.children[3];
        DOMEpisodes.setAttribute("data-more", "0");

        DOMSEpisodeCount.textContent = `${data.episodes.length} episodes`;
        DOMSTitle.textContent = data.name;
        DOMSDescription.textContent = data.overview;

        if (data.episodes.length > 0) {
            var episodes = data.episodes;
            for (var episode of episodes) {
                var DOMEpisode = DOMTEpisode.cloneNode(true);
                var DOMEImg = DOMEpisode.children[0].firstElementChild;
                var DOMENum = DOMEpisode.children[1];
                var DOMEDate = DOMEpisode.children[2].children[0];
                var DOMEName = DOMEpisode.children[2].children[1];
                var DOMETime = DOMEpisode.children[2].children[2];
                var DOMEDescription = DOMEpisode.children[2].children[3];
                if (episode.still_path !== null) {
                    DOMEImg.setAttribute(
                        "src",
                        `https://image.tmdb.org/t/p/w400${episode.still_path}`
                    );
                    DOMEImg.setAttribute("alt", episode.name);
                }

                DOMEDate.textContent = episode.air_date;
                DOMENum.textContent = episode.episode_number;

                DOMEName.textContent = episode.name;

                if (episode.runtime !== null) {
                    DOMETime.textContent = `${episode.runtime} min`
                }

                DOMEDescription.textContent = episode.overview;
                Modal.fragment.appendChild(DOMEpisode);
            }
            if (data.episodes.length > 4) {
                var DOMMore = DOMTButton.cloneNode(true);
                DOMMore.textContent = "more +";
                DOMMore.setAttribute("data-type", TYPE.MODAL_C_MORE);
                Modal.fragment.appendChild(DOMMore);
            }
            DOMEpisodes.replaceChildren(Modal.fragment);
        } else {
            DOMEpisodes.replaceChildren();
        }
    },
    DOMMSimilarFill(data, mediaType, DOMModalData, DFModal) {
        var dmdcLen = DOMModalData.children[3].children.length;
        var DOMSimilar = DOMModalData.children[3].children[dmdcLen - 2];
        var DOMContainer = DOMSimilar.lastElementChild;
        var DOMTItem = DFModal.children[5];
        var results = data.results
        if (results != null && 0 < results.length) {
            DOMSimilar.setAttribute("data-display", "1");
            var i = 0;
            while (i < results.length) {
                var dataItem = results[i];
                var DOMItem = DOMTItem.cloneNode(true);
                DOMItem.setAttribute("data-id", dataItem.id);
                let itemTitle;
                /**@type {"movie"| "tv"} */
                if (mediaType === "movie") {
                    itemTitle = dataItem.title;
                } else {
                    itemTitle = dataItem.name;
                }
                DOMItem.setAttribute("title", itemTitle);
                DOMItem.setAttribute("data-media", mediaType);
                var DOMImg = DOMItem.firstElementChild;
                var DOMH3 = DOMItem.lastElementChild;

                DOMImg.setAttribute("alt", itemTitle);
                DOMH3.insertAdjacentText("beforeend", itemTitle);

                if (dataItem.poster_path != null && dataItem.poster_path.length > 0) {
                    DOMImg.setAttribute(
                        "src",
                        `https://image.tmdb.org/t/p/w200${dataItem.poster_path}`
                    );
                } else {
                    DOMImg.setAttribute("data-display", "0");
                    DOMH3.setAttribute("data-opacity", "1");
                }
                Modal.fragment.appendChild(DOMItem);
                i += 1;
            }
            DOMContainer.appendChild(Modal.fragment);
        }
    },
    DOMMCreditsFill(data, mediaType, DOMModalData, DFModal) {
        var DOMCast = DOMModalData.children[3].children[5];
        var DOMCredits = DOMModalData.children[3].lastElementChild;

        var DOMTItem = DFModal.children[0];
        var DOMTCDep = DFModal.children[1];
        var DOMTCJob = DFModal.children[2];
        var DOMTSpan = DFModal.children[3];
        var DOMTButton = DFModal.children[4];

        var DOMDepart;
        var DOMItem;
        var DOMJob;
        var casts = data.cast;
        if (casts.length > 0) {
            DOMJob = DOMTCJob.cloneNode(true);
            DOMJob.setAttribute("data-more", "0");
            DOMJob.firstElementChild.textContent = "Cast:"

            for (var i = 0; i < casts.length; i += 1) {
                var cast = casts[i];
                if (mediaType === "movie") {
                    DOMItem = DOMTItem.cloneNode(false);
                    DOMItem.setAttribute(
                        "href",
                        `${window.location.origin}/discover?${Route.Q_MEDIA_TYPE}=${mediaType}&${Route.Q_CAST}=${cast.id}&${Route.Q_TITLE}=${cast.name} Movies`
                    );
                } else {
                    DOMItem = DOMTSpan.cloneNode(false);
                }
                DOMItem.setAttribute("data-id", cast.id);
                DOMItem.setAttribute("data-type", TYPE.MODAL_CAST);
                DOMItem.textContent = cast.name;
                DOMJob.appendChild(DOMItem);
            }
            if (casts.length > 3) {
                var DOMBut = DOMTButton.cloneNode(false);
                DOMBut.setAttribute("class", "more");
                DOMBut.setAttribute("data-type", TYPE.MODAL_C_MORE);
                DOMBut.textContent = "more";
                DOMJob.appendChild(DOMBut);
            }
            DOMCast.appendChild(DOMJob);

            DOMJob = undefined;
        }
        if (data.crew.length > 0) {
            var crews = data.crew;
            var data_len = Modal.orderCredits(crews);
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
                    mediaType === "movie"
                    && department === "Directing"
                    && (
                        job === "Director"
                        || job === "Series Director"
                        || job === "Action Director"
                    )
                ) {
                    DOMItem = DOMTItem.cloneNode(true);
                    DOMItem.setAttribute(
                        "href",
                        `${window.location.origin}/discover?${Route.Q_MEDIA_TYPE}=${mediaType}&${Route.Q_CREW}=${crew.id}&${Route.Q_TITLE}=${crew.name} Movies`
                    );
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
    },
    /**
    @type {(data: MDBIMovie, DOM: DOM_T) => undefined} */
    DOMMMovieFill(data, DOM) {
        var DOMModal = DOM.modal;
        var DOMTSec =  DOM.templateModal.content.children[2];
        var DOMTItem = DOM.templateModal.content.children[0];
        var DOMModalItem = DOMModal.children[1];

        var DOMImg = DOMModalItem.children[1].firstElementChild.firstElementChild;

        var DOMContent = DOMModalItem.children[3];
        var DOMTitle = DOMContent.children[0];
        var DOMGenres = DOMContent.children[1];
        var DOMDuration = DOMContent.children[2];
        var DOMDescription = DOMContent.children[3];
        var DOMPData = DOMContent.children[4]

        var DOMTItem = DOM.templateModal.content.children[0]
        var DOMTSpan = DOM.templateModal.content.children[3]
        var DOMTButton = DOM.templateModal.content.children[4]

        var DOMItem;

        DOMTitle.textContent = data.title;
        DOMDescription.textContent = data?.overview;
        if (data.runtime !== undefined) {
            DOMDuration.textContent = `${data.runtime} min`
        }

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
                DOMItem.setAttribute(
                    "href",
                    `${window.location.origin}/discover?${Route.Q_MEDIA_TYPE}=movie&${Route.Q_GENRE}=${genre.id}&${Route.Q_TITLE}=${encodeURIComponent(genre.name)} Movies`
                );
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
        DOMPData?.appendChild(DOMPopularity);

        var DOMDate = DOMTSec.cloneNode(true);
        DOMDate.firstElementChild.textContent = "Release Date:";
        DOMItem = DOMTSpan.cloneNode(true);
        DOMItem.textContent = data.release_date;
        DOMDate.appendChild(DOMItem);
        DOMPData?.appendChild(DOMDate);

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
            DOMPData?.appendChild(DOMLang);
        }
        if (data.production_countries.length > 0) {
            var DOMPC = DOMTSec.cloneNode(true);
            DOMPC.firstElementChild.textContent = "Countries:";
            for (var countries of data.production_countries) {
                DOMItem = DOMTSpan.cloneNode(true);
                DOMItem.textContent = countries.name;
                DOMPC.appendChild(DOMItem);
            }
            DOMPData?.appendChild(DOMPC);
        }
        if (data.production_companies.length > 0) {
            var DOMPC = DOMTSec.cloneNode(true);
            DOMPC.setAttribute("data-more", "0");
            DOMPC.firstElementChild.textContent = "Companies:";
            for (var companies of data.production_companies) {
                DOMItem = DOMTItem.cloneNode(true);
                DOMItem.setAttribute(
                    "href",
                    `${window.location.origin}/discover?${Route.Q_MEDIA_TYPE}=movie&${Route.Q_COMPANY}=${companies.id}&${Route.Q_TITLE}=${encodeURIComponent(companies.name)} Movies`
                );
                DOMItem.setAttribute("data-type", TYPE.MODAL_COMPANY);
                DOMItem.setAttribute("data-id", companies.id);
                DOMItem.textContent = companies.name;
                DOMPC.appendChild(DOMItem);
            }
            if (data.production_companies.length > 3) {
                var DOMBut = DOMTButton.cloneNode(false);
                DOMBut.setAttribute("class", "more");
                DOMBut.setAttribute("data-type", TYPE.MODAL_C_MORE);
                DOMBut.textContent = "more";
                DOMPC.appendChild(DOMBut);
            }
            DOMPData?.appendChild(DOMPC);
        }
    },
    /**
    @type {(data: MDBITv, DOM: DOM_T) => undefined} */
    DOMMTvFill(data, DOM) {
        var DOMModal = DOM.modal;
        var DOMTSec =  DOM.templateModal.content.children[2];
        var DOMTItem = DOM.templateModal.content.children[0];
        var DOMModalItem = DOMModal.children[0];
        var DOMImg = DOMModalItem.children[1].firstElementChild.firstElementChild;

        var DOMContent = DOMModalItem.children[3];
        var DOMTitle = DOMContent.children[0];
        var DOMGenres = DOMContent.children[1];
        var DOMDuration = DOMContent.children[2];
        var DOMDescription = DOMContent.children[3];
        var DOMPData = DOMContent.children[4];
        var DOMSeason = DOMContent.children[6];

        var DOMTItem = DOM.templateModal.content.children[0];
        var DOMTSpan = DOM.templateModal.content.children[3];
        var DOMTButton = DOM.templateModal.content.children[4];
        var DOMTSeason = DOM.templateModal.content.children[6];
        var DOMTOption = DOM.templateModal.content.children[7];

        var DOMItem;

        DOMTitle.textContent = data.name;
        DOMDescription.textContent = data?.overview;

        DOMDuration.textContent = `${data.number_of_episodes} episodes, ${data.number_of_seasons} seasons`;

        if (data?.backdrop_path != null) {
            DOMImg.setAttribute(
                "src",
                `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
            );
            DOMImg.setAttribute("alt", data.name)
            DOMImg.setAttribute("data-display", "1");
        }

        if (data.genres.length > 0) {
            for (var genre of data.genres) {
                DOMItem = DOMTItem.cloneNode(true);
                DOMItem.textContent = genre.name;
                DOMItem.setAttribute(
                    "href",
                    `${window.location.origin}/discover?${Route.Q_MEDIA_TYPE}=tv&${Route.Q_GENRE}=${genre.id}&${Route.Q_TITLE}=${encodeURIComponent(genre.name)} Tv Series`
                );
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
        DOMPData?.appendChild(DOMPopularity);

        var DOMDate = DOMTSec.cloneNode(true);
        DOMDate.firstElementChild.textContent = "First Air Date:";
        DOMItem = DOMTSpan.cloneNode(true);
        DOMItem.textContent = data.first_air_date;
        DOMDate.appendChild(DOMItem);
        DOMPData.appendChild(DOMDate);

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
            DOMPData?.appendChild(DOMLang);
        }
        if (data.production_countries.length > 0) {
            var DOMPC = DOMTSec.cloneNode(true);
            DOMPC.firstElementChild.textContent = "Countries:";
            for (var countries of data.production_countries) {
                DOMItem = DOMTSpan.cloneNode(true);
                DOMItem.textContent = countries.name;
                DOMPC.appendChild(DOMItem);
            }
            DOMPData?.appendChild(DOMPC);
        }
        if (data.production_companies.length > 0) {
            var DOMPC = DOMTSec.cloneNode(true);
            DOMPC.setAttribute("data-more", "0");
            DOMPC.firstElementChild.textContent = "Companies:";
            for (var companies of data.production_companies) {
                DOMItem = DOMTItem.cloneNode(true);
                DOMItem.setAttribute(
                    "href",
                    `${window.location.origin}/discover?${Route.Q_MEDIA_TYPE}=tv&${Route.Q_COMPANY}=${companies.id}&${Route.Q_TITLE}=${encodeURIComponent(companies.name)} Tv Series`
                );
                DOMItem.setAttribute("data-type", TYPE.MODAL_COMPANY);
                DOMItem.setAttribute("data-id", companies.id);
                DOMItem.textContent = companies.name;
                DOMPC.appendChild(DOMItem);
            }
            if (data.production_companies.length > 3) {
                var DOMBut = DOMTButton.cloneNode(false);
                DOMBut.setAttribute("class", "more");
                DOMBut.setAttribute("data-type", TYPE.MODAL_C_MORE);
                DOMBut.textContent = "more";
                DOMPC.appendChild(DOMBut);
            }
            DOMPData?.appendChild(DOMPC);
        }
        if (Modal.seasonNumber !== -1) {
            var seasons = data.seasons;
            var DOMCSeason = DOMTSeason.content.cloneNode(true);
            var DOMSSelect = DOMCSeason.children[0].lastElementChild;

            DOMSeason.setAttribute("data-display", "1");
            if (seasons.length > 1) {
                for (let i = 0; i < seasons.length; i += 1) {
                    var n = seasons[i].season_number;
                    var DOMOption = DOMTOption.cloneNode(false);
                    if (n === 1) {
                        DOMOption.setAttribute("selected", "true");
                    }
                    DOMOption.textContent = `Season ${n}`;
                    DOMOption.setAttribute("value", String(n));
                    DOMSSelect.appendChild(DOMOption);
                }
            } else {
                DOMSSelect.setAttribute("data-display", "0");
            }
            DOMSeason.appendChild(DOMCSeason);

        }
    },
    /**
    @type {(DOM: DOM_T) => undefined} */
    close(DOM) {
        if (
            !Modal.dataLoaded
            || !Modal.creditsLoaded
            || !Modal.similarLoaded
            || !Modal.seasonLoaded
        ) {
            abortFetch("The modal is closed");
        }

        var DOMModalItem;
        if (Modal.mediaType === "tv") {
            DOMModalItem = DOM.modal.children[0];
        } else {
            DOMModalItem = DOM.modal.children[1];
        }
        var DOMImg = DOMModalItem.children[1].firstElementChild?.firstElementChild;
        var DOMContent = DOMModalItem.children[3];

        DOMImg?.setAttribute("data-display", "0");
        DOMImg?.setAttribute("src", "");
        DOMImg?.setAttribute("alt", "");

        var l = DOMContent.children.length;
        DOMContent.children[0].replaceChildren();       //DOMTitle
        DOMContent.children[1].replaceChildren();       //DOMGenters
        DOMContent.children[2].replaceChildren();       //DOMDuration
        DOMContent.children[3].replaceChildren();       //DOMDescription
        DOMContent.children[4].replaceChildren();       //DOMPrimaryData
        DOMContent.children[5].replaceChildren();       //DOMCast
        DOMContent.lastElementChild.replaceChildren();  //DOMCredits

        if (Modal.mediaType === "tv") {
            var DOMSeason = DOMContent.children[6];
            DOMSeason.replaceChildren();
            DOMSeason.setAttribute("data-display", "0");
        }

        var DOMSimilars = DOMContent.children[l - 2]
        DOMSimilars.setAttribute("data-display", "0");
        DOMSimilars.lastElementChild.replaceChildren();

        DOM.main.style.removeProperty("transform");
        DOM.main.toggleAttribute("data-fixed");

        DOM.modal.setAttribute("data-display", "0");
        document.firstElementChild.scrollTop = Modal.topScroll;

        Modal.isOpen = false;
        Modal.seasonNumber = -1;
        Modal.id = "";
        Modal.dataLoaded = false;
        Modal.creditsLoaded = false;
        Modal.similarLoaded = false;
        Modal.seasonLoaded = false;
    },
    /**
    @type {(
        mediaType: "tv" | "movie",
        id: string,
        DOM: DOM_T,
        changeRoute: boolean,
    ) => undefined}*/
    open(mediaType, id, DOM, changeRoute) {
        Modal.topScroll = document.firstElementChild.scrollTop;
        document.firstElementChild.scrollTop = 0;

        Modal.isOpen = true;
        Modal.mediaType = mediaType;
        Modal.id = id;

        DOM.modal.setAttribute("data-display", "1");
        DOM.modal.setAttribute("data-select", mediaType);

        DOM.main.style.setProperty(
            "transform",
            `translateY(-${Modal.topScroll}px)`
        );
        DOM.main.toggleAttribute("data-fixed");
        Modal.getData(mediaType, id, DOM, changeRoute);
    },
    /**
    @type {(target: HTMLElement, DOM: DOM_T) => undefined} */
    onchange(target, DOM) {
        var type = target.getAttribute("data-type");
        if (type === TYPE.MODAL_SEASON_N) {
            var value = Number(target.value);
            if (value === NaN) {
                    return;
            }
            if (value !== Modal.seasonNumber) {
                Modal.seasonNumber = value;
                Modal.getSeason(
                    Modal.id,
                    value,
                    DOM.modal.children[0],
                    DOM.templateModal.content
                );
            }
        }
    },
    /**
    @type {(target: HTMLElement, DOM: DOM_T) => undefined} */
    onclick(target, DOM) {
        var type = target.getAttribute("data-type");
        if (type === TYPE.MODAL || type === TYPE.MODAL_CLOSE) {
            Modal.close(DOM);
            Route.pushstate(Route.href);
        } else if (type === TYPE.MODAL_C_MORE) {
            target.parentElement.setAttribute("data-more", "1")
        } else if (type === TYPE.ITEM) {
            var id = target?.getAttribute("data-id");
            var mediaType = target?.getAttribute("data-media");
            Modal.close(DOM);
            Modal.open(mediaType, id, DOM, true);
        }
    }
};

export default {
    TYPE,
    API,
    Theme,
    Hero,
    Nav,
    Route,
    Item,
    Modal,
    Utils,
};
