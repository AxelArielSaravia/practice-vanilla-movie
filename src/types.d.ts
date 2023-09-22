type maybe<T> = T | undefined;

type ThemeColor = ("light" | "dark");

type HeroItem = MBDTrendingItem

type MDBResponse<T> = {
    page: number,
    results: Array<T>,
    total_pages: number,
    toral_results: number,
};

type MDBGenres = Array<{
    id: number,
    name:string
}>;

type MDBTrending = {
    adult: boolean,
    backdrop_path: string,
    id: number,
    title: string,
    original_language: string,
    original_title: string,
    overview: string,
    poster_path: string,
    media_type: string,
    genre_ids: Array<number>,
    popularity: number,
    release_date: string,
    video: boolean,
    vote_average: number,
    vote_count: number
};

type MDBDiscover = {
    backdrop_path: null | string,
    first_air_date: string,
    genre_ids: Array<number>,
    id: number,
    name: string,
    origin_country: Array<string>,
    original_language: string,
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: number,
    vote_average: number,
        vote_count: number,
};

type MDBImageItem = {
    aspect_radio: number,
    height: number,
    iso_639_1: string,
    file_path: string,
    vote_average: number,
    vote_count: number,
    width: number
};

type MDBImages = {
    backdrops: Array<MBImageItem>,
    id: number,
    logos: Array<MBImageItem>,
    posters: Array<MBImageItem>
};


// Override
interface LocalStorage {
    getItem(i: "theme"): "dark" | "light";
}
