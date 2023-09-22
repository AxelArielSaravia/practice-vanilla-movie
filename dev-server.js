import * as fs from "node:fs";
import * as path from "node:path";

import trending from "./api/trending.js";
import popular from "./api/popular.js";
import discover from "./api/discover.js";
import images from "./api/images.js";
import genres from "./api/genres.js";
import toprated from "./api/toprated.js";

const DIR = path.resolve(import.meta.dir, "src");
const PORT = 3333;

const RES_OPTS = {status: 404};
const STATSYNC_OPTS = {bigint: false, throwIfNoEntry: false};

const ResponseBad = new Response("File not found", RES_OPTS);

const Url = new URL("a:0.a");

function staticResponse(req, reqPath) {
    if (reqPath === "/") {
        reqPath = "/index.html";
    }

    let extension = path.extname(reqPath);
    if (extension.length === 0) {
        console.warn("The request path is bad:", reqPath);
        return ResponseBad;
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
        console.warn(`WARNING: No such file or directory: ${basePath}`);
    }
    return ResponseBad;
}

const server = Bun.serve({
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
            }
            return ResponseBad;
        } else {
            return staticResponse(req, reqPath);
        }
    }
});

console.log(`Server listening on http://127.0.0.1:${server.port}`);
