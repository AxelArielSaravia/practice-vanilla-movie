import * as fs      from "node:fs";
import * as path    from "node:path";

import trending from "./api/trending.js";
import popular  from "./api/popular.js";
import discover from "./api/discover.js";
import images   from "./api/images.js";
import genres   from "./api/genres.js";
import toprated from "./api/toprated.js";
import movie    from "./api/movie.js";
import tv       from "./api/tv.js";
import credits  from "./api/credits.js";
import season  from "./api/season.js";

const PORT = Number(process.env.VANILLA_MOVIE_PORT);

const PROD_PATH = "public";
const DEV_PATH = "src";

var DIR = "";
if (process.env.VANILLA_MOVIE_PRODUCTION !== undefined) {
    DIR = path.resolve(import.meta.dir, PROD_PATH);
    console.info("Production mode");
} else {
    DIR = path.resolve(import.meta.dir, DEV_PATH);
    console.info("Development mode");
}

const RES_OPTS = {status: 404};
const STATSYNC_OPTS = {bigint: false, throwIfNoEntry: false};

const ResponseBad = new Response("File not found", RES_OPTS);

const Url = new URL("a:0.a");

function response404() {
    var basePath = path.join(DIR, "/404.html");
    return new Response(Bun.file(basePath));
}

function staticResponse(req, reqPath) {
    if (reqPath === "/") {
        reqPath = "/index.html";
    }
    if (reqPath === "/movie") {
        reqPath = "/movie/index.html";
    }
    if (reqPath === "/tv") {
        reqPath = "/tv/index.html";
    }
    if (reqPath === "/discover") {
        reqPath = "/discover/index.html"
    }
    if (reqPath === "/popular") {
        reqPath = "/popular/index.html"
    }
    if (reqPath === "/top_rated") {
        reqPath = "/top_rated/index.html"
    }
    if (reqPath === "/trending") {
        reqPath = "/trending/index.html"
    }

    let extension = path.extname(reqPath);
    if (extension.length === 0) {
        return response404();
    }

    let basePath = "";
    let stat;
    basePath = path.join(DIR, reqPath);

    try {
        stat = fs.statSync(basePath, STATSYNC_OPTS);
    } catch {
        console.error("Error in statSync");
        return ResponseBad;
    };

    if (stat !== undefined && stat.isFile()) {
        console.info("Request path exist. Sending:", reqPath);
        return new Response(Bun.file(basePath));
    } else {
        return response404();
    }
}

Bun.serve({
    port: PORT,
    async fetch(req) {
        console.info("New request URL:", req.url);

        Url.href = req.url
        let reqPath = Url.pathname;
        console.info(req.method, reqPath);

        if (reqPath.startsWith("/api/")) {
            if (reqPath.endsWith("trending")) {
                return trending(req);
            } else if (reqPath.endsWith("popular")) {
                return popular(req);
            } else if (reqPath.endsWith("discover")) {
                return discover(req);
            } else if (reqPath.endsWith("images")) {
                return images(req);
            } else if (reqPath.endsWith("genres")) {
                return genres(req);
            } else if (reqPath.endsWith("toprated")) {
                return toprated(req);
            } else if (reqPath.endsWith("movie")) {
                return movie(req);
            } else if (reqPath.endsWith("tv")) {
                return tv(req);
            } else if (reqPath.endsWith("credits")) {
                return credits(req);
            } else if (reqPath.endsWith("season")) {
                return season(req);
            }
            return ResponseBad;
        } else {
            return staticResponse(req, reqPath);
        }
    }
});
console.info(`Server listening on http://127.0.0.1:${PORT}`);
