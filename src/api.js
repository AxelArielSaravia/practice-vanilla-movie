const BACKDROP_IMG_SIZES = [
    "w200",
    "w300",
    "w400",
    "w780",
    "w1280",
];
const LOGO_IMG_SIZES = [
    "w45",
    "w92",
    "w154",
    "w185",
    "w300",
    "w500",
];

/**
@type {(res: Response) => Promise<object> | undefined}*/
function fetchResolve(res) {
    if (res.ok) {
        return res.json();
    }
}

const API = {
    //Get trending movies and tv series
    /**
    @type {(page: string) => Promise<maybe<MDBResponse<MDBTrending>>>} */
    getTrending(page = "1") {
        return (
            fetch(`${window.location.origin}/api/trending?page=${page}`)
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
            fetch(`${window.location.origin}/api/popular?type=${type}&page=${page}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(
        type: "movie" | "tv",
        genre: number,
        page: string
    ) => Promise<maybe<MDBResponse<MDBDiscover>>>}*/
    getDiscover(type, genre, page = "1") {
        var p = `${window.location.origin}/api/discover?type=${type}&page=${page}`;
        if (genre !== undefined) {
            p = `${p}&genre=${genre}`;
        }
        return fetch(p).then(fetchResolve);
    },
    /**
    @type {(
        id: string,
        type: "movie" | "tv",
    ) => Promise<maybe<MDBImages>>} */
    getImages(id, type) {
        return (
            fetch(`${window.location.origin}/api/images?type=${type}&id=${id}`)
            .then(fetchResolve)
       );
    },
    /**
    @type {(type: "movie" | "tv") => Promise<maybe<MDBGenres>>} */
    getGenres(type) {
        return (
            fetch(`${window.location.origin}/api/genres?type=${type}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(
        type: "movie" | "tv",
        page: string
    ) => Promise<maybe<MDBResponse<MDBDiscover>>>} */
    getTopRated(type, page = "1") {
        return (
            fetch(`${window.location.origin}/api/toprated?type=${type}&page=${page}`)
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
        var url = `${window.location.origin}/api/${type}?id=${id}`;
        if (similar) {
            url += "&similar"
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
            `${window.location.origin}/api/credits?type=${type}&id=${id}`,
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
            `${window.location.origin}/api/season?id=${id}&n=${n}`,
            option
        ).then(fetchResolve);
    }
};

export default API;
