import G from "./general.js";

const TYPE = {
    /**
    @type {"4"}*/
    COLL_TITLE: "4",
    /**
    @type {"5"}*/
    COLL_BUTTON: "5",
};

const Collection = {
    TYPE_SBUTTON: "data-sbuttont",
    TRENDING:   "0",
    POPULAR:    "1",
    TOP_RATED:  "2",
    DISCOVER:   "3",
    /**
    @type {(target: HTMLElement) => undefined} */
    DOMCollButtonOnclick(target) {
        /**@type {HTMLElement}*/
        var DOMSlider = target.parentElement.lastElementChild;
        /**@type {HTMLButtonElement}*/
        const DOMButtonL = target.parentElement.children[1];
        /**@type {HTMLButtonElement}*/
        const DOMButtonR = target.parentElement.children[2];
        var type = target.getAttribute(Collection.TYPE_SBUTTON);
        var scrollval = (
            DOMSlider.clientWidth - ((DOMSlider.clientWidth * 6) / 100)
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
        header: string,
        data: object,
        mediaType: "movie" | "tv" | "all",
        collectionType: "0" | "1" | "2" | "3",
        genreId: undefined | string,
        DFCollection: DocumentFragment,
    ) => HTMLElement}*/
    createDOMCollection(
        header,
        data,
        mediaType,
        collectionType,
        genreId,
        DFCollection
    ) {
        /**@type {HTMLElement}*/
        var DOMCollection = DFCollection.children[1].cloneNode(true);
        var DOMTItem = DFCollection.children[2];

        var DOMTitle = DOMCollection.children[0]
        DOMTitle.insertAdjacentText("beforeend", header);

        if (collectionType === Collection.TRENDING) {
            DOMTitle.setAttribute(
                "href",
                `${window.location.origin}/trending?${G.Route.Q_MEDIA_TYPE}=${mediaType}`
            );
        } else if (collectionType === Collection.POPULAR) {
            DOMTitle.setAttribute(
                "href",
                `${window.location.origin}/popular?${G.Route.Q_MEDIA_TYPE}=${mediaType}`
            );
        } else if (collectionType === Collection.TOP_RATED) {
            DOMTitle.setAttribute(
                "href",
                `${window.location.origin}/top_rated?${G.Route.Q_MEDIA_TYPE}=${mediaType}`
            );
        } else if (collectionType === Collection.DISCOVER) {
            if (genreId !== undefined) {
                DOMTitle.setAttribute(
                    "href",
                    `${window.location.origin}/discover?${G.Route.Q_MEDIA_TYPE}=${mediaType}&${G.Route.Q_GENRE}=${genreId}&${G.Route.Q_TITLE}=${encodeURIComponent(header)}`
                );
            }
        }
        for (var dataItem of data) {
            const DOMItem = G.Item.createDOMItem(dataItem, mediaType, DOMTItem);
            DOMCollection.lastElementChild.appendChild(DOMItem);
        }
        return DOMCollection;
    },
};

const View = {
    /**
    @type {(
        DataPromise: Promise<object>,
        title: string,
        mediaType: "movie" | "tv",
        genre: undefined | string,
        i: number,       //relavie index of the DOM children
        base: number,   //absolute index of the first DOM children
        DOM: DOM_T
    ) => Promise<undefined>} */
    async discover(DataPromise, title, mediaType, genre, i, base, DOM) {
        var data = await DataPromise;
        console.info(title, data);
        if (data?.results === undefined || data.results.length === 0) {
            throw Error("API.getTopRated does not have data");
        }
        var DOMColl = Collection.createDOMCollection(
            /*header*/          title,
            /*data*/            data.results,
            /*mediaType*/       mediaType,
            /*collectionType*/  Collection.DISCOVER,
            /*genreId*/         genre,
            /*DFCollection*/    DOM.templateCollection.content,
        );
        var DOMPos = DOM.view.children[base + i];
        DOMPos.insertAdjacentElement("beforebegin", DOMColl);
        DOMPos.remove();
    },
    /**
    @type {(target: HTMLElement, DOM: DOM_T, e: Event) => undefined} */
    onclick(target, DOM, e) {
        var type = target.getAttribute("data-type");
        if (type === TYPE.COLL_BUTTON) {
            Collection.DOMCollButtonOnclick(target);
        } else if (type === G.TYPE.ITEM) {
            e.preventDefault();
            var mediaType = target.getAttribute("data-media");
            var id = target.getAttribute("data-id");
            if (mediaType !== null && id !== null) {
                G.Modal.open(
                    /*mediaType*/   mediaType,
                    /*id*/          id,
                    /*DOM*/         DOM,
                    /*changeRoute*/ true
                );
            } else {
                console.error("View onclick bad mediaType or id");
            }
        }
    }
};

export default {
    TYPE,
    Collection,
    View
};
