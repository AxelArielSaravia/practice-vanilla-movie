import _utils from "./_utils.js";

var SEARCH = "?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    var url = new URL(req.url);
    var qtype = url.searchParams.get("type");
    var qpage = url.searchParams.get("page");
    var qgenre = url.searchParams.get("genre");
    if (qtype !== "movie" && qtype !== "tv") {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    var p = `${process.env.API_URL}/discover/${qtype}${SEARCH}`;
    if (qpage !== undefined) {
        p = `${p}&page=${qpage}`;
    }
    if (qgenre !== undefined) {
        p = `${p}&with_genres=${qgenre}`;
    }
    const r = await fetch(p, _utils.FETCH_OPT);
    if (!r.ok) {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    return new Response(r.body, _utils.RES_OPT);
}
