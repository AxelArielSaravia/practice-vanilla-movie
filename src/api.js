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
            fetch(`http://127.0.0.1:3333/api/trending?page=${page}`)
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
            fetch(`http://127.0.0.1:3333/api/popular?type=${type}&page=${page}`)
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
        var p = `http://127.0.0.1:3333/api/discover?type=${type}&page=${page}`;
        if (genre !== undefined) {
            p = `${p}&genre=${genre}`;
        }
        return fetch(p).then(fetchResolve);
    },
    /**
    @type {(
        id: string,
        type: "movie" | "tv",
        page: string
    ) => Promise<maybe<MDBImages>>} */
    getImages(id, type, page = "1") {
        return (
            fetch(`http://127.0.0.1:3333/api/images?type=${type}&id=${id}&page=${page}`)
            .then(fetchResolve)
        );
    },
    /**
    @type {(type: "movie" | "tv") => Promise<maybe<MDBGenres>>} */
    getGenres(type) {
        return (
            fetch(`http://127.0.0.1:3333/api/genres?type=${type}`)
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
            fetch(`http://127.0.0.1:3333/api/toprated?type=${type}&page=${page}`)
            .then(fetchResolve)
        );
    }
};

export default API;
