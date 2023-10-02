type maybe<T> = T | undefined;

type ThemeColor = ("light" | "dark");


type DOM_T = {
    templateCollection: HTMLTemplateElement,
    templateIcons: HTMLTemplateElement,
    templateModal: HTMLTemplateElement,
    //header
    headerButtonNav: HTMLButtonElement,
    headerNav: HTMLElement,
    headerButtonSearch: HTMLButtonElement,
    headerButtonTheme: HTMLButtonElement,
    //main
    main: HTMLElement,
    hero: HTMLElement,
    view: HTMLElement,
    buttonMore: HTMLButtonElement,

    modal: HTMLElement,
};


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

type MDBIMovie = {
    adult: boolean,
    backdrop_path: null | string,
    belongs_to_collection: null | Array<{
        id: number,
        name: string,
        poster_path: string,
        backdrop_path: string
    }>,
    budget: 0,
    genres: Array<{
        id: number,
        name: string
    }>,
    homepage: string,
    id: number,
    imdb_id: null | string,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: null | string,
    production_companies: Array<{
        id: number,
        logo_path: string,
        name: string,
        origin_country: string
    }>,
    production_countries: Array<{
        iso_3166_1: string,
        name: string
    }>
    release_date: string,
    revenue: number,
    runtime: number,
    spoken_languages: Array<{
        english_name: string,
        iso_639_1: string,
        name: string
    }>,
    status: string,
    tagline: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
};

type MDBITv = {
    adult: boolean,
    backdrop_path: null | string,
    created_by: Array<{
        id: number,
        credit_id: string,
        name: string,
        gender: number,
        profile_path: string
    }>,
    episode_run_time: Array<number>,
    first_air_date: string,
    genres: Array<{
        id: number,
        name: string
    }>,
    homepage: string,
    id: number,
    in_production: true,
    languages: Array<string>,
    last_air_date: string,
    last_episode_to_air: null | {
        id: number,
        name: string,
        overview: string,
        vote_average: number,
        vote_count: number,
        air_date: string,
        episode_number: number,
        episode_type: string,
        production_code: string,
        runtime: number,
        season_number: number,
        show_id: number,
        still_path: null | string
    },
    name: string,
    next_episode_to_air: null | {
        id: number,
        name: string,
        overview: string,
        vote_average: number,
        vote_count: number,
        air_date: string,
        episode_number: number,
        episode_type: string,
        production_code: string,
        runtime: number,
        season_number: number,
        show_id: number,
        still_path: null | string
    },
    networks: Array<{
        id: number,
        logo_path: string,
        name: string,
        origin_country: string
    }>,
    number_of_episodes: number,
    number_of_seasons: number,
    origin_country: Array<string>,
    original_language: string,
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: Array<{
        id: number,
        logo_path: string,
        name: string,
        origin_country: string
    }>,
    production_countries: Array<{
        iso_3166_1: string,
        name: string
    }>,
    seasons: Array<{
        air_date: string,
        episode_count: number,
        id: number,
        name: string,
        overview: string,
        poster_path: string,
        season_number: number,
        vote_average: number
    }>,
    spoken_languages: Array<{
        english_name: string,
        iso_639_1: string,
        name: string
    }>,
    status: string,
    tagline: string,
    type: string,
    vote_average: number,
    vote_count: number
};


type MDBCrew = Array<{
    adult: boolean,
    gender: number,
    id: number,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: null | string,
    credit_id: string,
    department: string,
    job: string,
}>;

type MDBCredits = {
    id: string,
    cast: Array<{
        adult: boolean,
        cast_id: number,
        character: string,
        credit_id: string,
        gender: number,
        id: number,
        known_for_department: string,
        name: string,
        order: number,
        original_name: string,
        popularity: number,
        profile_path: string,
    }>,
    crew: MDBCrew,
};

type MDBSeason = {
    air_date: string,
    episodes: Array<{
        air_date: string,
        crew: Array<{}>,
        episode_number: number,
        episode_type: string,
        guest_stars: Array<{}>,
        id: number,
        name: string,
        overview: string,
        production_code: string,
        runtime: number,
        season_number: number,
        show_id: number,
        still_path: string,
        vote_average: number,
        vote_count: number,
    }>,
    id: number,
    name: string,
    overview: string,
    poster_path: string,
    season_number: number,
    vote_average: number,
    _id: string,
}

// Override
interface LocalStorage {
    getItem(i: "theme"): "dark" | "light";
}
